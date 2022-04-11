<template>
  <SignPage
    v-model:account='account'
    v-model:account-type='accountType'
    v-model:password='password'
    v-model:accountError='accountError'
    @submit='onSubmit'
    label='MSG_USER_REGISTRATION'
    submit-text='MSG_REGISTER'
  >
    <template #append-account>
      <q-btn class='send-code alt' @click='onSendCodeClick'>
        {{ $t('MSG_SEND_CODE') }}
      </q-btn>
      <Input
        v-model:value='verificationCode'
        :label='accountType === AccountType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
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
    <template #append-password>
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
            v-html='$t("MSG_READ_AND_AGREE", { POLICY_PATH: "#/legal", USER_AGREEMENT: "#/legal" })'
          />
        </div>
      </div>
    </template>
    <template #append-submit>
      <p class='skip-registration' v-html='$t("MSG_GOTO_SIGNIN", { SIGNIN_PATH: "/signin" })' />
    </template>
  </SignPage>
</template>

<script setup lang='ts'>
import {
  useCodeRepoStore,
  useLangStore,
  MessageUsedFor,
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

const SignPage = defineAsyncComponent(() => import('src/components/user/SignPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const accountError = ref(false)
const account = ref('')
const accountType = ref('')
const password = ref('')

const verificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !validateVerificationCode(verificationCode.value)
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
  accountError.value = !account.value.length
  if (accountError.value) {
    return
  }

  switch (accountType.value) {
    case AccountType.Email:
      coderepo.sendEmailCode({
        LangID: lang.CurLang?.ID as string,
        EmailAddress: account.value,
        UsedFor: MessageUsedFor.Signup,
        ToUsername: account.value,
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
        PhoneNO: account.value,
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
  confirmPasswdError.value = !validatePassword(confirmPassword.value) ||
                             password.value !== confirmPassword.value

  if (accountError.value ||
      verificationCodeError.value ||
      confirmPasswdError.value) {
    return
  }

  user.signup({
    PasswordHash: encryptPassword(password.value),
    Account: account.value,
    AccountType: accountType.value,
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
