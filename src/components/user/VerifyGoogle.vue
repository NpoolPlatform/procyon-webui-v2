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
  useFrontendUserStore,
  AccountType,
  NotifyType,
  User,
  SignMethodType,
  validateVerificationCode
} from 'npool-cli-v4'
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

const router = useRouter()
const user = useFrontendUserStore()

const onSubmit = () => {
  if (verificationCodeError.value || oldVerificationCodeError.value) {
    return
  }
  let _oldAccountType = SignMethodType.Email
  switch (oldAccountType.value) {
    case AccountType.Mobile:
      _oldAccountType = SignMethodType.Mobile
      break
    case AccountType.Google:
      _oldAccountType = SignMethodType.Google
      break
  }
  user.updateUser({
    Account: oldAccount.value,
    AccountType: _oldAccountType,
    VerificationCode: oldVerificationCode.value,
    NewAccountType: AccountType.Google as unknown as SignMethodType,
    NewVerificationCode: myVerificationCode.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_ACCOUNT'),
        Message: t('MSG_UPDATE_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (u: User, error: boolean) => {
    if (error) {
      return
    }
    void router.push({ path: '/security' })
  })

  return false
}

</script>

<style lang='sass' scoped>
</style>
