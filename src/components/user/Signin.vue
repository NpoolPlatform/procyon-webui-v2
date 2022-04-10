<template>
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
</template>

<script setup lang='ts'>
import {
  useCodeRepoStore,
  NotificationType,
  useUserStore,
  encryptPassword,
  GoogleTokenType,
  useInspireStore
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const SignPage = defineAsyncComponent(() => import('src/components/user/SignPage.vue'))

const accountError = ref(false)
const account = ref('')
const accountType = ref('')
const password = ref('')

const user = useUserStore()
const coderepo = useCodeRepoStore()
const recaptcha = useReCaptcha()
const inspire = useInspireStore()

const router = useRouter()

const onSubmit = () => {
  console.log('submit', account.value, accountError.value, accountType.value)

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
      void router.push({ path: '/' })
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
