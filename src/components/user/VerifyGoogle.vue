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
import { user, appuserbase, notify, utils } from 'src/npoolstore'
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

const UpdatePage = defineAsyncComponent(() => import('src/components/user/UpdatePage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const oldAccount = ref('')
const oldAccountType = ref(appuserbase.SignMethodType.Email)
const oldVerificationCode = ref('')
const oldVerificationCodeError = ref(false)

const myVerificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !utils.validateVerificationCode(myVerificationCode.value)
}

const router = useRouter()
const _user = user.useUserStore()

const onSubmit = () => {
  if (verificationCodeError.value || oldVerificationCodeError.value) {
    return
  }
  let _oldAccountType = appuserbase.SignMethodType.Email
  switch (oldAccountType.value) {
    case appuserbase.SignMethodType.Mobile:
      _oldAccountType = appuserbase.SignMethodType.Mobile
      break
    case appuserbase.SignMethodType.Google:
      _oldAccountType = appuserbase.SignMethodType.Google
      break
  }
  _user.updateUser({
    Account: oldAccount.value,
    AccountType: _oldAccountType,
    VerificationCode: oldVerificationCode.value,
    NewAccountType: appuserbase.SignMethodType.Google,
    NewVerificationCode: myVerificationCode.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ACCOUNT',
        Message: 'MSG_UPDATE_ACCOUNT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
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
