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
            <a href='#/reset/password'>{{ $t('MSG_FORGOT_PASSWORD') }}?</a>
          </p>
          <q-space />
          <p class='skip-registration'>
            <span class='no-account'>{{ $t('MSG_NO_ACCOUNT') }}? </span>
            <a href='#/registration'>{{ $t('MSG_REGISTER_NOW') }}.</a>
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
  NotificationType,
  useUserStore,
  encryptPassword,
  GoogleTokenType,
  useInspireStore,
  useApplicationStore,
  useLoginedUserStore,
  AccountType,
  MessageUsedFor,
  useKYCStore,
  ReviewState
} from 'npool-cli-v2'
import { AppID } from 'src/const/const'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const SignPage = defineAsyncComponent(() => import('src/components/user/SignPage.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

const accountError = ref(false)
const account = ref('')
const accountType = ref(AccountType.Email)
const password = ref('')

const verifyAccount = ref(account)
const verifyAccountType = ref(accountType)

const user = useUserStore()
const coderepo = useCodeRepoStore()
const recaptcha = useReCaptcha()
const inspire = useInspireStore()
const application = useApplicationStore()
const logined = useLoginedUserStore()
const kyc = useKYCStore()

const router = useRouter()

const verifing = ref(false)
const verifyMethod = ref(AccountType.Email)

const onMenuHide = () => {
  verifing.value = false
}

const remainder = () => {
  if (!logined.LoginedUser?.User?.PhoneNO?.length) {
    void router.push({ path: '/remainder/mobile' })
    return
  }

  kyc.getKYC({
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    if (error || !kyc.KYC?.Kyc || kyc.KYC.State === ReviewState.Rejected) {
      void router.push({ path: '/remainder/kyc' })
      return
    }
    if (!logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified) {
      void router.push({ path: '/remainder/ga' })
      return
    }
    void router.push({ path: '/' })
  })
}

const onCodeVerify = (code: string) => {
  verifing.value = false
  coderepo.verifyCode(verifyMethod.value, MessageUsedFor.Signin, code, (error: boolean) => {
    if (!error) {
      remainder()
      return
    }
    user.logout({
      Message: {
        Error: {
          Title: t('MSG_LOGOUT_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  })
}

const _verify = () => {
  if (!application.Application.Ctrl.SigninVerifyEnable) {
    void router.push({ path: '/' })
    return
  }

  verifing.value = true

  if (logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified &&
    logined.LoginedUser?.Ctrl?.SigninVerifyByGoogleAuthentication) {
    verifyMethod.value = AccountType.Google
    return
  }
  if (logined.LoginedUser?.User?.EmailAddress?.length) {
    verifyMethod.value = AccountType.Email
    return
  }
  verifyMethod.value = AccountType.Mobile
}

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

const onSubmit = () => {
  if (accountError.value) {
    return
  }

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
    user.signin({
      PasswordHash: encryptPassword(password.value),
      Account: account.value,
      AccountType: accountType.value,
      ManMachineSpec: token,
      Message: {
        Error: {
          Title: t('MSG_SIGNIN'),
          Message: t('MSG_SIGNIN_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      inspire.getInvitationCode({
        Message: {
          Error: {
            Title: t('MSG_GET_INVITATION_CODE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      })
      verify()
    })
  })

  return false
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
