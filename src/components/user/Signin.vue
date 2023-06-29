<template>
  <div :class='[ verifying ? "blur" : "" ]'>
    <SignPage
      v-model:account='account'
      v-model:account-type='accountType'
      v-model:password='password'
      v-model:accountError='accountError'
      @submit='onSubmit'
      label='MSG_USER_LOGIN'
      submit-text='MSG_SIGNIN'
      :submitting='logging || submitting'
    >
      <template #append-submit>
        <div class='row'>
          <p class='skip-registration'>
            <a target='_blank' @click='router.push({ path: "/reset/password" })'>{{ $t('MSG_FORGOT_PASSWORD') }}</a>
          </p>
          <q-space />
          <p class='skip-registration'>
            <span class='no-account'>{{ $t('MSG_NO_ACCOUNT') }} </span>
            <a target='_blank' @click='router.push({ path: "registration" })'>{{ $t('MSG_REGISTER_NOW') }}</a>
          </p>
        </div>
      </template>
    </SignPage>
  </div>
  <q-dialog
    v-model='verifying'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='popup'>
      <CodeVerifier
        v-model:account='verifyAccount'
        v-model:account-type='verifyAccountType'
        v-model:verify-method='verifyMethod'
        @verify='onCodeVerify'
        :used-for='UsedFor.Signin'
        :disabled='submitting'
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>

import {
  useFrontendUserStore,
  NotifyType,
  User,
  AccountType,
  useFrontendAppStore,
  useLocalUserStore,
  SigninVerifyType,
  useFrontendKYCStore,
  KYCState,
  UsedFor,
  useFrontendVerifyStore,
  encryptPassword,
  GoogleTokenType,
  useFrontendNotifStore
} from 'npool-cli-v4'

import { AppID } from 'src/const/const'
import { defineAsyncComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRoute, useRouter } from 'vue-router'
import { throttle } from 'quasar'
import { getNotifs } from 'src/api/notif'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const SignPage = defineAsyncComponent(() => import('src/components/user/SignPage.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

const route = useRoute()
interface MyQuery {
  target: string;
}
const query = computed(() => route.query as unknown as MyQuery)
const target = computed(() => query.value?.target)

const accountError = ref(false)
const account = ref('')
const accountType = ref(AccountType.Email)
const password = ref('')

const verifyAccount = ref('')
const verifyAccountType = ref(AccountType.Email)

const coderepo = useFrontendVerifyStore()
const recaptcha = useReCaptcha()
const app = useFrontendAppStore()
const kyc = useFrontendKYCStore()

const router = useRouter()

const verifying = ref(false)
const verifyMethod = ref(AccountType.Email)

const onMenuHide = () => {
  verifying.value = false
}

const user = useFrontendUserStore()
const logined = useLocalUserStore()

const logging = ref(false)

const onSubmit = throttle(() => {
  coderepo.getGoogleToken({
    Recaptcha: recaptcha,
    Req: GoogleTokenType.Login,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOGLE_TOKEN'),
        Message: t('MSG_GET_GOOGLE_TOKEN_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (token: string) => {
    logging.value = true
    user.login({
      Account: account.value,
      PasswordHash: encryptPassword(password.value),
      AccountType: accountType.value,
      ManMachineSpec: token,
      EnvironmentSpec: 'NOT USED',
      Message: {
        Error: {
          Title: t('MSG_SIGNIN'),
          Message: t('MSG_SIGNIN_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, (u: User, error: boolean) => {
      if (error) {
        logging.value = false
        return
      }
      verify()
    })
  })

  return false
}, 1000)

const notif = useFrontendNotifStore()
const notifications = computed(() => notif.Notifs.Notifs)

const verify = () => {
  app.getApp({
    AppID: AppID,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    _verify()
  })
}

const _verify = () => {
  if (!app.App.SigninVerifyEnable) {
    if (target.value?.length) {
      void router.push({
        path: target.value,
        query: route.query
      })
      return
    }
    void router.push({ path: '/' })
    remainder()
    if (logined.logined && notifications.value?.length === 0) {
      getNotifs(0, 500)
    }
    return
  }

  verifying.value = true

  if (logined.User?.GoogleAuthVerified && logined.User?.SigninVerifyType === SigninVerifyType.Google) {
    verifyMethod.value = AccountType.Google
    return
  }
  if (logined.User?.EmailAddress?.length) {
    verifyMethod.value = AccountType.Email
    return
  }
  verifyMethod.value = AccountType.Mobile
}

const submitting = ref(false)

const resetStatus = () => {
  submitting.value = false
  verifying.value = false
  logging.value = false
}

const onCodeVerify = (code: string) => {
  submitting.value = true
  verifying.value = true

  user.loginVerify({
    Account: verifyAccount.value,
    AccountType: verifyAccountType.value,
    UserID: logined.User?.ID,
    Token: logined.User?.LoginToken,
    VerificationCode: code,
    Message: {
      Error: {
        Title: t('MSG_LOGIN_VERIFY'),
        Message: t('MSG_LOGIN_VERIFY_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (u: User, error: boolean) => {
    if (error) {
      user.logout({
        Token: logined.User?.LoginToken,
        Message: {}
      }, () => {
        // TODO
      })
      resetStatus()
      return
    }
    if (target.value?.length) {
      void router.push({
        path: target.value,
        query: route.query
      })
      resetStatus()
      return
    }
    remainder()
  })
}

const remainder = () => {
  if (!logined.User?.PhoneNO?.length) {
    void router.push({ path: '/remainder/mobile' })
    return
  }

  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    if (error || !kyc.KYC || kyc.KYC.State === KYCState.Rejected) {
      void router.push({ path: '/remainder/kyc' })
      return
    }
    if (logined.User?.Kol && !logined.User?.KolConfirmed) {
      void router.push({ path: '/remainder/affiliate' })
      return
    }
    if (!logined.User?.GoogleAuthVerified) {
      void router.push({ path: '/remainder/ga' })
      return
    }
    resetStatus()
    void router.push({ path: '/' })
  })

  if (logined.logined && notifications.value?.length === 0) {
    getNotifs(0, 500)
  }
}
</script>

<style lang='sass' scoped>
.agreement-check
  width: 24px

.error
  outline: 2px solid #e85f1a

.agreement-label
  width: calc(100% - 24px)
  line-height: 100%

.no-account
  color: white
</style>
