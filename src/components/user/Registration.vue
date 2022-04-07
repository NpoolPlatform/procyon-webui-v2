<template>
  <FormPage @submit='onSubmit'>
    <template #form-body>
      <Input
        v-model:value='emailAddress'
        label='MSG_EMAIL_ADDRESS'
        type='email'
        id='email'
        required
        :error='emailError'
        message='MSG_EMAIL_TIP'
        placeholder='MSG_EMAIL_PLACEHOLDER'
        @focus='onEmailFocusIn'
        @blur='onEmailFocusOut'
      />
      <q-btn class='send-code alt' @click='onSendCodeClick'>
        {{ $t('MSG_SEND_CODE') }}
      </q-btn>
      <Input
        v-model:value='verificationCode'
        label='MSG_EMAIL_VERIFICATION_CODE'
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
        :error='confirmPasswdError'
        message='MSG_CONFIRM_PASSWORD_TIP'
        placeholder='MSG_PASSWORD_PLACEHOLDER'
        @focus='onConfirmPasswordFocusIn'
        @blur='onConfirmPasswordFocusOut'
      />
      <Input
        v-model:value='invitationCode'
        label='MSG_INVITATION_CODE'
        type='text'
        id='inv-code'
        :required='false'
        :error='invCodeError'
        message='MSG_INVITATION_CODE_TIP'
        placeholder='MSG_INVITATION_CODE_PLACEHOLDER'
      />
      <div class='row'>
        <div class='agreement-check'>
          <input
            type='checkbox'
            id='agreement'
            name='agreement'
            :class='[ agreeError ? "error" : "" ]'
            v-model='agree'
            @focus='onAgreeFocusIn'
            @blur='onAgreeFocusOut'
          >
        </div>
        <div class='agreement-label column  justify-center'>
          <label
            for='agreement'
            v-html='$t("MSG_READ_AND_AGREE", { POLICY_PATH: "/policy", USER_AGREEMENT: "/agreement" })'
          />
        </div>
      </div>
      <input type='submit' :value='$t("MSG_REGISTER")' class='register'>
      <p class='skip-registration' v-html='$t("MSG_GOTO_SIGNIN", { SIGNIN_PATH: "/signin" })' />
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import {
  useCodeRepoStore,
  useLangStore,
  MessageUsedFor,
  validateEmailAddress,
  NotificationType,
  validateVerificationCode,
  validatePassword,
  useUserStore,
  encryptPassword,
  AccountType
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const emailAddress = ref('')
const emailError = ref(false)
const onEmailFocusIn = () => {
  emailError.value = false
}
const onEmailFocusOut = () => {
  emailError.value = !validateEmailAddress(emailAddress.value)
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
const confirmPasswdError = ref(false)
const onConfirmPasswordFocusIn = () => {
  confirmPasswdError.value = false
}
const onConfirmPasswordFocusOut = () => {
  confirmPasswdError.value = !validatePassword(confirmPassword.value) ||
                             password.value !== confirmPassword.value
}

const invitationCode = ref('')
const invCodeError = ref(false)

const agree = ref(false)
const agreeError = ref(false)
const onAgreeFocusIn = () => {
  agreeError.value = false
}

const onAgreeFocusOut = () => {
  agreeError.value = !agree.value
}

const coderepo = useCodeRepoStore()
const lang = useLangStore()
const user = useUserStore()

const router = useRouter()

const onSendCodeClick = () => {
  if (!validateEmailAddress(emailAddress.value)) {
    return
  }

  coderepo.sendEmailCode({
    LangID: lang.CurLang?.ID as string,
    EmailAddress: emailAddress.value,
    UsedFor: MessageUsedFor.Signup,
    ToUsername: emailAddress.value,
    Message: {
      Error: {
        Title: t('MSG_SEND_EMAIL_CODE'),
        Message: t('MSG_SEND_EMAIL_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

const onSubmit = () => {
  if (emailError.value ||
      verificationCodeError.value ||
      pwdError.value ||
      confirmPasswdError.value) {
    return
  }

  user.signup({
    PasswordHash: encryptPassword(password.value),
    Account: emailAddress.value,
    AccountType: AccountType.Email,
    VerificationCode: verificationCode.value,
    InvitationCode: invitationCode.value,
    Message: {
      Error: {
        Title: t('MSG_SIGNUP'),
        Message: t('MSG_SIGNUP_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    void router.push({ path: '/signin' })
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
</style>
