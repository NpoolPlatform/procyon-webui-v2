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
          :label='accountType === appuserbase.SignMethodType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
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
          required
          :error='invCodeError'
          message='MSG_INVITATION_CODE_TIP'
          placeholder='MSG_INVITATION_CODE_PLACEHOLDER'
          :disabled='originInvitationCode?.length > 0'
          @focus='onConfirmInvCodeErrorFocusIn'
          @blur='onConfirmInvCodeErrorFocusOut'
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
        <p class='skip-registration' v-html='$t("MSG_GOTO_SIGNIN", { SIGNIN_PATH: "/signin" })' />
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
            <button class='my-button' @click='onAgreeClick'>
              {{ $t('MSG_AGREE') }}
            </button>
            <button class='alt my-button' @click='onCancelClick'>
              {{ $t('MSG_CANCEL') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { utils, notify, user, coderepo, basetypes, appuserbase } from 'src/npoolstore'
import { defineAsyncComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Query {
  code: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const originInvitationCode = computed(() => query.value.code)

const SignPage = defineAsyncComponent(() => import('src/components/user/SignPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))
const Legal = defineAsyncComponent(() => import('src/pages/Legal.vue'))

const accountError = ref(false)
const account = ref('')
const accountType = ref(appuserbase.SignMethodType.Email)
const password = ref('')

const verificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !utils.validateVerificationCode(verificationCode.value)
}

const confirmPassword = ref('')
const confirmPasswdError = ref(false)
const onConfirmPasswordFocusIn = () => {
  confirmPasswdError.value = false
}
const onConfirmPasswordFocusOut = () => {
  confirmPasswdError.value = !utils.validatePassword(confirmPassword.value) ||
                             password.value !== confirmPassword.value
}
const onConfirmInvCodeErrorFocusIn = () => {
  invCodeError.value = false
}
const onConfirmInvCodeErrorFocusOut = () => {
  if (!invitationCode.value) {
    invCodeError.value = true
  }
  invCodeError.value = invitationCode.value?.length !== 12
}

const invitationCode = ref(originInvitationCode.value)
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
  agree.value = true
  onAgreeFocusOut()
}
const onCancelClick = () => {
  showStatus.value = false
  onAgreeFocusOut()
}

const _coderepo = coderepo.useCodeRepoStore()

const router = useRouter()

const onSendCodeClick = () => {
  accountError.value = !account.value.length
  if (accountError.value) {
    return
  }
  _coderepo.sendVerificationCode(account.value, accountType.value as unknown as appuserbase.SigninVerifyType, basetypes.EventType.Signup, account.value)
}

const _user = user.useUserStore()

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

  _user.signup({
    PasswordHash: utils.encryptPassword(password.value),
    Account: account.value,
    AccountType: accountType.value,
    VerificationCode: verificationCode.value,
    InvitationCode: invitationCode.value,
    Message: {
      Error: {
        Title: 'MSG_SIGNUP',
        Message: 'MSG_SIGNUP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
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

.my-button
  margin: auto 0 auto 18px !important
</style>
