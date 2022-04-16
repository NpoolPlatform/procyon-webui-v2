<template>
  <div :class='[ showStatus ? "blur" : "" ]'>
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
        <TimeoutSendBtn :initial-clicked='false' :target-error='accountError' @click='onSendCodeClick' />
        <Input
          v-model:value='verificationCode'
          :label='accountType === AccountType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
          type='text'
          id='ver-code'
          required
          :error='verificationCodeError'
          message='MSG_VERIFICATION_CODE_TIP'
          :autocomplete='false'
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
          <div class='agreement-label column  justify-center' @click='onAgreementClick'>
            <label
              v-html='$t("MSG_READ_AND_AGREE", { POLICY_PATH: "javascript:void(0);", USER_AGREEMENT: "javascript:void(0);" })'
            />
          </div>
        </div>
      </template>
      <template #append-submit>
        <p class='skip-registration' v-html='$t("MSG_GOTO_SIGNIN", { SIGNIN_PATH: "#/signin" })' />
      </template>
    </SignPage>
  </div>
  <q-dialog
    v-model='showStatus'
    seamless
    maximized
  >
    <div class='popup'>
      <div class='form-container policy'>
        <div class='confirmation'>
          <Legal />
        </div>
        <div class='row'>
          <q-space />
          <div class='buttons'>
            <button @click='onAgreeClick'>
              {{ $t('MSG_AGREE') }}
            </button>
            <button class='alt' @click='onCancelClick'>
              {{ $t('MSG_CANCEL') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  useCodeRepoStore,
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
const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))
const Legal = defineAsyncComponent(() => import('src/components/help/Legal.vue'))

const accountError = ref(false)
const account = ref('')
const accountType = ref(AccountType.Email)
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

const showStatus = ref(false)
const onAgreementClick = () => {
  showStatus.value = true
}
const onAgreeClick = () => {
  showStatus.value = false
  onAgreeFocusOut()
  agree.value = true
}
const onCancelClick = () => {
  showStatus.value = false
  onAgreeFocusOut()
}

const coderepo = useCodeRepoStore()
const user = useUserStore()

const router = useRouter()

const onSendCodeClick = () => {
  accountError.value = !account.value.length
  if (accountError.value) {
    return
  }
  coderepo.sendVerificationCode(account.value, accountType.value, MessageUsedFor.Signup, account.value)
}

const onSubmit = () => {
  onConfirmPasswordFocusOut()
  onAgreeFocusOut()
  onVerificationCodeFocusOut()

  if (accountError.value ||
      verificationCodeError.value ||
      confirmPasswdError.value ||
      agreeError.value) {
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
  cursor: pointer

.product-container
  background: transparent

.policy
  max-width: 100% !important

.popup
  background-color: transparent
  display: block !important
</style>
