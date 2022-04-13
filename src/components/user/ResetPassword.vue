<template>
  <FormPage @submit='onSubmit' label='MSG_RESET_PASSWORD' submit-text='MSG_SUBMIT'>
    <template #top-right>
      <div class='switcher' @click='onSwitcherClick'>
        <q-icon
          class='icon'
          size='1.5em'
          :name='signupMethod === AccountType.Email ? "smartphone" : "email"'
        />
        <q-tooltip anchor='center end'>
          {{ signupMethod === AccountType.Email ? $t('MSG_SWITCH_REGISTER_WITH_MOBILE') : $t('MSG_SWITCH_REGISTER_WITH_EMAIL') }}
        </q-tooltip>
      </div>
    </template>
    <template #form-body>
      <PhoneNO
        v-if='signupMethod === AccountType.Mobile'
        v-model:value='phoneNO'
        :error='accountError'
        @focus='onPhoneNOFocusIn'
        @blur='onPhoneNOFocusOut'
      />
      <Input
        v-if='signupMethod === AccountType.Email'
        v-model:value='emailAddress'
        label='MSG_EMAIL_ADDRESS'
        type='email'
        id='email'
        required
        :error='accountError'
        message='MSG_EMAIL_TIP'
        placeholder='MSG_EMAIL_PLACEHOLDER'
        @focus='onEmailFocusIn'
        @blur='onEmailFocusOut'
      />
      <TimeoutSendBtn :initial-clicked='false' :target-error='accountError' @click='onSendCodeClick' />
      <Input
        v-model:value='verificationCode'
        :label='signupMethod === AccountType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
        type='text'
        id='ver-code'
        required
        :error='verificationCodeError'
        message='MSG_VERIFICATION_CODE_TIP'
        placeholder='MSG_VERIFICATION_CODE_PLACEHOLDER'
        @focus='onVerificationCodeFocusIn'
        @blur='onVerificationCodeFocusOut'
      />
      <Input
        v-model:value='password'
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
        v-model:value='confirmPassword'
        label='MSG_CONFIRM_PASSWORD'
        type='password'
        id='pass'
        required
        :error='confirmPwdError'
        message='MSG_PASSWORD_TIP'
        placeholder='MSG_PASSWORD_PLACEHOLDER'
        @focus='onConfirmPasswordFocusIn'
        @blur='onConfirmPasswordFocusOut'
      />
    </template>
    <template #append-submit>
      <slot name='append-submit' />
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import {
  validateEmailAddress,
  validatePassword,
  AccountType,
  validateMobileNO,
  validateVerificationCode,
  useCodeRepoStore,
  MessageUsedFor,
  useUserStore,
  encryptPassword,
  NotificationType
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const PhoneNO = defineAsyncComponent(() => import('src/components/input/PhoneNO.vue'))
const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const accountError = ref(false)
const onAccountError = () => {
  accountError.value = signupMethod.value === AccountType.Email ? !validateEmailAddress(emailAddress.value) : !validateMobileNO(phoneNO.value)
}

const phoneNO = ref('')
const onPhoneNOFocusIn = () => {
  accountError.value = false
}
const onPhoneNOFocusOut = () => {
  onAccountError()
}

const emailAddress = ref('')
const onEmailFocusIn = () => {
  accountError.value = false
}
const onEmailFocusOut = () => {
  onAccountError()
}

const verificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !validateVerificationCode(verificationCode.value)
}

const password = ref('')
const pwdError = ref(false)
const onPasswordFocusIn = () => {
  pwdError.value = false
}
const onPasswordFocusOut = () => {
  pwdError.value = !validatePassword(password.value)
}

const confirmPassword = ref('')
const confirmPwdError = ref(false)
const onConfirmPasswordFocusIn = () => {
  confirmPwdError.value = false
}
const onConfirmPasswordFocusOut = () => {
  confirmPwdError.value = !validatePassword(confirmPassword.value) || confirmPassword.value !== password.value
}

const signupMethod = ref(AccountType.Email)
const onSwitcherClick = () => {
  switch (signupMethod.value) {
    case AccountType.Email:
      signupMethod.value = AccountType.Mobile
      break
    case AccountType.Mobile:
      signupMethod.value = AccountType.Email
      break
  }
  accountError.value = false
}

const coderepo = useCodeRepoStore()
const user = useUserStore()
const router = useRouter()

const onSubmit = () => {
  onConfirmPasswordFocusOut()
  onPasswordFocusOut()
  onVerificationCodeFocusOut()
  onAccountError()

  if (accountError.value || pwdError.value || confirmPwdError.value || verificationCodeError.value) {
    return
  }

  const account = signupMethod.value === AccountType.Email ? emailAddress.value : phoneNO.value
  user.resetPassword({
    Account: account,
    AccountType: signupMethod.value,
    VerificationCode: verificationCode.value,
    PasswordHash: encryptPassword(password.value),
    Message: {
      Error: {
        Title: t('MSG_SET_WITHDRAW_ADDRESS'),
        Message: t('MSG_SET_WITHDRAW_ADDRESS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    void router.push({ path: '/' })
  })

  return false
}

const onSendCodeClick = () => {
  onAccountError()
  if (accountError.value) {
    return
  }

  const account = signupMethod.value === AccountType.Email ? emailAddress.value : phoneNO.value
  coderepo.sendVerificationCode(account, signupMethod.value, MessageUsedFor.Update, account)
}

</script>

<style lang='sass' scoped>
.switcher
  width: 0
  height: 0
  border-width: 32px
  border-style: solid
  border-color: #ff964a #ff964a transparent transparent
  cursor: pointer
  border-top-right-radius: 12px

.icon
  margin-right: -48px
  margin-top: -56px
</style>
