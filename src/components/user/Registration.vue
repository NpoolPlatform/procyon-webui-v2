<template>
  <FormPage @submit='onSubmit' label='MSG_USER_REGISTRATION'>
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
      <Input
        v-if='signupMethod === AccountType.Mobile'
        v-model:value='phoneNO'
        label='MSG_PHONE_NO'
        type='text'
        id='text'
        required
        :error='accountError'
        message='MSG_PHONE_TIP'
        placeholder='MSG_PHONE_NO_PLACEHOLDER'
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
  AccountType,
  validateMobileNO
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const accountError = ref(false)

const phoneNO = ref('')
const onPhoneNOFocusIn = () => {
  accountError.value = false
}
const onPhoneNOFocusOut = () => {
  accountError.value = !validateMobileNO(phoneNO.value)
}

const emailAddress = ref('')
const onEmailFocusIn = () => {
  accountError.value = false
}
const onEmailFocusOut = () => {
  accountError.value = !validateEmailAddress(emailAddress.value)
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
const lang = useLangStore()
const user = useUserStore()

const router = useRouter()

const onSendCodeClick = () => {
  if (accountError.value) {
    return
  }

  switch (signupMethod.value) {
    case AccountType.Email:
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
      break
    case AccountType.Mobile:
      coderepo.sendSMSCode({
        LangID: lang.CurLang?.ID as string,
        PhoneNO: phoneNO.value,
        UsedFor: MessageUsedFor.Signup,
        Message: {
          Error: {
            Title: t('MSG_SEND_SMS_CODE'),
            Message: t('MSG_SEND_SMS_CODE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      })
      break
  }
}

const onSubmit = () => {
  if (accountError.value ||
      verificationCodeError.value ||
      pwdError.value ||
      confirmPasswdError.value) {
    return
  }

  let account = emailAddress.value
  if (signupMethod.value === AccountType.Mobile) {
    account = phoneNO.value
  }

  user.signup({
    PasswordHash: encryptPassword(password.value),
    Account: account,
    AccountType: signupMethod.value,
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
