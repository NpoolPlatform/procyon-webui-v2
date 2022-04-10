<template>
  <UpdatePage
    @submit='onSubmit'
    label='MSG_GOOGLE_AUTHENTICATOR'
    submit-text='MSG_SUBMIT'
    v-model:account='oldAccount'
    v-model:account-type='oldAccountType'
    v-model:verification-code='oldVerificationCode'
    v-model:verification-code-error='oldVerificationCodeError'
  >
    <template #body>
      <Input
        v-model:value='myVerificationCode'
        label='MSG_GOOGLE_VERIFICATION_CODE'
        type='text'
        id='ver-code'
        required
        :error='verificationCodeError'
        message='MSG_VERIFICATION_CODE_TIP'
        placeholder='MSG_VERIFICATION_CODE_PLACEHOLDER'
        @focus='onVerificationCodeFocusIn'
        @blur='onVerificationCodeFocusOut'
      />
    </template>
  </UpdatePage>
</template>

<script setup lang='ts'>
import {
  AccountType,
  validateVerificationCode,
  NotificationType,
  useCodeRepoStore,
  useUserStore
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const UpdatePage = defineAsyncComponent(() => import('src/components/user/UpdatePage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const oldAccount = ref('')
const oldAccountType = ref(AccountType.Email)
const oldVerificationCode = ref('')
const oldVerificationCodeError = ref(false)

const myVerificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !validateVerificationCode(myVerificationCode.value)
}

const coderepo = useCodeRepoStore()
const user = useUserStore()
const router = useRouter()

const onSubmit = () => {
  if (verificationCodeError.value || oldVerificationCodeError.value) {
    return
  }

  user.updateAccount({
    Account: '',
    AccountType: AccountType.Google,
    VerificationCode: myVerificationCode.value,
    VerificationCodes: [
      {
        Account: oldAccount.value,
        AccountType: oldAccountType.value,
        VerificationCode: oldVerificationCode.value
      }
    ],
    Message: {
      Error: {
        Title: t('MSG_UPDATE_ACCOUNT'),
        Message: t('MSG_UPDATE_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    coderepo.verifyGoogleAuthenticationCode({
      Code: myVerificationCode.value,
      NotifyMessage: {
        Error: {
          Title: t('MSG_VERIFY_GOOGLE_AUTHENTICATION'),
          Message: t('MSG_VERIFY_GOOGLE_AUTHENTICATION_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (error: boolean) => {
      if (!error) {
        void router.push({ path: '/security' })
      }
    })
  })

  return false
}

</script>

<style lang='sass' scoped>
</style>
