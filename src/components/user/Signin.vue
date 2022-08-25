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
  useApplicationStore,
  AccountType,
  MessageUsedFor,
  useKYCStore,
  ReviewState,
  NotificationType,
  useInspireStore
} from 'npool-cli-v2'

import {
  useFrontendUserStore,
  NotifyType,
  User
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
const application = useApplicationStore()
const kyc = useKYCStore()

const router = useRouter()

const verifing = ref(false)
const verifyMethod = ref(AccountType.Email)

const onMenuHide = () => {
  verifing.value = false
}

const user = useFrontendUserStore()
const loginUser = ref({} as User)

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
      loginUser.value = u
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
  if (!application.Application) {
    application.getApplication({
      ID: AppID,
      Message: {
        Error: {
          Title: t('MSG_GET_APP_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      _verify()
    })
    return
  }

  _verify()
}

const _verify = () => {
  if (!application.Application.Ctrl.SigninVerifyEnable) {
    void router.push({ path: '/' })
    return
  }

  verifing.value = true

  if (loginUser?.value.GoogleAuthVerified && loginUser?.value.SigninVerifyByGoogleAuth) {
    verifyMethod.value = AccountType.Google
    return
  }
  if (loginUser?.value.EmailAddress?.length) {
    verifyMethod.value = AccountType.Email
    return
  }
  verifyMethod.value = AccountType.Mobile
}

const onCodeVerify = (code: string) => {
  verifing.value = false
  coderepo.verifyCode(verifyMethod.value, MessageUsedFor.Signin, code, (error: boolean) => {
    if (!error) {
      user.loginVerify({
        Token: loginUser.value.LoginToken,
        VerificationCode: code,
        Message: {

        }
      }, () => {
        remainder()
      })

      return
    }
    user.logout({
      Token: loginUser.value.LoginToken,
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
  })
}

const inspire = useInspireStore()

const remainder = () => {
  if (!loginUser?.value.PhoneNO?.length) {
    void router.push({ path: '/remainder/mobile' })
    return
  }

  // FIXME
  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    if (error || !kyc.KYC?.Kyc || kyc.KYC.State === ReviewState.Rejected) {
      void router.push({ path: '/remainder/kyc' })
      return
    }
    // FIXME
    inspire.getInvitationCode({
      Message: {}
    }, () => {
      if (inspire.InvitationCode && !inspire.InvitationCode?.Confirmed) {
        void router.push({ path: '/remainder/affiliate' })
        return
      }
      if (!loginUser?.value.GoogleAuthVerified) {
        void router.push({ path: '/remainder/ga' })
        return
      }
      void router.push({ path: '/' })
    })
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
