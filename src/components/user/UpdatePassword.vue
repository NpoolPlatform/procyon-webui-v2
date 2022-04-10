<template>
  <UpdatePage
    @submit='onSubmit'
    label='MSG_UPDATE_PASSWORD'
    submit-text='MSG_SUBMIT'
    v-model:account='account'
    v-model:account-type='accountType'
    v-model:verification-code='verificationCode'
    v-model:verification-code-error='verificationCodeError'
  >
    <template #body>
      <Input
        v-model:value='oldPassword'
        label='MSG_PASSWORD'
        type='password'
        id='pass'
        required
        :error='pwdError'
        message='MSG_PASSWORD_TIP'
        placeholder='MSG_PASSWORD_PLACEHOLDER'
        @focus='onPasswordFocusIn'
        @blur='onPasswordFocusOut'
      />
      <Input
        v-model:value='newPassword'
        label='MSG_NEW_PASSWORD'
        type='password'
        id='pass'
        required
        :error='newPwdError'
        message='MSG_PASSWORD_TIP'
        placeholder='MSG_PASSWORD_PLACEHOLDER'
        @focus='onNewPasswordFocusIn'
        @blur='onNewPasswordFocusOut'
      />
      <Input
        v-model:value='confirmPassword'
        label='MSG_CONFIRM_PASSWORD'
        type='password'
        id='pass'
        required
        :error='newPwdError'
        message='MSG_PASSWORD_TIP'
        placeholder='MSG_PASSWORD_PLACEHOLDER'
        @focus='onConfirmPasswordFocusIn'
        @blur='onConfirmPasswordFocusOut'
      />
    </template>
  </UpdatePage>
</template>

<script setup lang='ts'>
import {
  validatePassword,
  AccountType
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'

const UpdatePage = defineAsyncComponent(() => import('src/components/user/UpdatePage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const account = ref('')
const accountType = ref(AccountType.Email)
const verificationCode = ref('')
const verificationCodeError = ref(false)

const oldPassword = ref('')
const pwdError = ref(false)
const onPasswordFocusIn = () => {
  pwdError.value = false
}
const onPasswordFocusOut = () => {
  pwdError.value = !validatePassword(oldPassword.value)
}

const newPassword = ref('')
const newPwdError = ref(false)
const onNewPasswordFocusIn = () => {
  newPwdError.value = false
}
const onNewPasswordFocusOut = () => {
  newPwdError.value = !validatePassword(newPassword.value)
}

const confirmPassword = ref('')
const confirmPwdError = ref(false)
const onConfirmPasswordFocusIn = () => {
  confirmPwdError.value = false
}
const onConfirmPasswordFocusOut = () => {
  confirmPwdError.value = !validatePassword(confirmPassword.value)
}

const onSubmit = () => {
  if (newPwdError.value || pwdError.value || confirmPwdError.value || verificationCodeError.value) {
    return
  }

  console.log('submit', account, 2, accountType, 3, verificationCode, 4, oldPassword, 5, newPassword, 6, confirmPassword)

  return false
}

</script>

<style lang='sass' scoped>
</style>
