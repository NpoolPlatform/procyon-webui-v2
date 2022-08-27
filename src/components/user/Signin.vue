<template>
  <div :class='[ verifing ? "blur" : "" ]'>
    <SignPage
      v-model:account='account'
      v-model:account-type='accountType'
      v-model:password='password'
      v-model:accountError='accountError'
      @submit='onSubmit'
      label='MSG_USER_LOGIN'
      submit-text='MSG_SIGNIN'
    >
      <template #append-submit>
        <div class='row'>
          <p class='skip-registration'>
            <a href='#/reset/password'>{{ $t('MSG_FORGOT_PASSWORD') }}</a>
          </p>
          <q-space />
          <p class='skip-registration'>
            <span class='no-account'>{{ $t('MSG_NO_ACCOUNT') }} </span>
            <a href='#/registration'>{{ $t('MSG_REGISTER_NOW') }}</a>
          </p>
        </div>
      </template>
    </SignPage>
  </div>
  <q-dialog
    v-model='verifing'
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
        :used-for='MessageUsedFor.Signin'
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useCodeRepoStore,
  encryptPassword,
  GoogleTokenType,
  MessageUsedFor,
  NotificationType
} from 'npool-cli-v2'

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
  SignMethodType
} from 'npool-cli-v4'

import { AppID, ThrottleSeconds } from 'src/const/const'
import { defineAsyncComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRoute, useRouter } from 'vue-router'
import { throttle } from 'quasar'
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

const verifyAccount = ref(account)
const verifyAccountType = ref(accountType)

const coderepo = useCodeRepoStore()
const recaptcha = useReCaptcha()
const app = useFrontendAppStore()
const kyc = useFrontendKYCStore()

const router = useRouter()

const verifing = ref(false)
const verifyMethod = ref(AccountType.Email)

const onMenuHide = () => {
  verifing.value = false
}

const user = useFrontendUserStore()
const logined = useLocalUserStore()

const onSubmit = throttle(() => {
  coderepo.getGoogleToken({
    Recaptcha: recaptcha,
    Req: GoogleTokenType.Login,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOGLE_TOKEN'),
        Message: t('MSG_GET_GOOGLE_TOKEN_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (token: string) => {
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
        return
      }
      if (target.value?.length) {
        void router.push({
          path: target.value,
          query: route.query
        })
        return
      }
      verify()
    })
  })

  return false
}, ThrottleSeconds * 1000)

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
    void router.push({ path: '/' })
    return
  }

  verifing.value = true

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

const onCodeVerify = (code: string) => {
  verifing.value = false
  user.loginVerify({
    Account: verifyAccount.value,
    AccountType: verifyAccountType.value as unknown as SignMethodType,
    UserID: logined.User?.ID,
    Token: logined.User?.LoginToken,
    VerificationCode: code,
    Message: {}
  }, (u: User, error: boolean) => {
    if (error) {
      user.logout({
        Token: logined.User?.LoginToken,
        Message: {
          Error: {
            Title: t('MSG_LOGOUT_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
      // TODO
      })
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
    if (logined.User?.InvitationCode && !logined.User?.InvitationCodeConfirmed) {
      void router.push({ path: '/remainder/affiliate' })
      return
    }
    if (!logined.User?.GoogleAuthVerified) {
      void router.push({ path: '/remainder/ga' })
      return
    }
    void router.push({ path: '/' })
  })
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
