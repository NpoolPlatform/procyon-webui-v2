<template>
  <FormPage @submit='onSubmit' :label='label' :submit-text='submitText' :submitting='submitting'>
    <template #top-center>
      <!-- <div class='switcher' @click='onSwitcherClick'>
        <q-icon
          class='icon'
          size='1.5em'
          :name='signupMethod === AccountType.Email ? "smartphone" : "email"'
        />
        <q-tooltip anchor='center end'>
          {{ signupMethod === AccountType.Email ? $t('MSG_SWITCH_REGISTER_WITH_MOBILE') : $t('MSG_SWITCH_REGISTER_WITH_EMAIL') }}
        </q-tooltip>
      </div> -->
      <div class='email-phone-selector'>
        <div :class='["top", loginWithEmail ? "selected" : ""]' @click='onSwitcherClick(appuserbase.SignMethodType.Mobile)'>
          <img src='font-awesome/email.svg'><span>{{ $t('MSG_SWITCH_REGISTER_WITH_EMAIL') }}</span>
        </div>
        <div class='divider' />
        <div :class='["bottom", !loginWithEmail ? "selected" : ""]' @click='onSwitcherClick(appuserbase.SignMethodType.Email)'>
          <img src='font-awesome/phone.svg'><span>{{ $t('MSG_SWITCH_REGISTER_WITH_MOBILE') }}</span>
        </div>
      </div>
    </template>
    <template #form-body>
      <div v-show='signupMethod === appuserbase.SignMethodType.Mobile'>
        <PhoneNO
          v-model:value='phoneNO' :error='accountError' @focus='onPhoneNOFocusIn' @blur='onPhoneNOFocusOut'
          :required='signupMethod === appuserbase.SignMethodType.Mobile'
        />
      </div>
      <div v-show='signupMethod === appuserbase.SignMethodType.Email'>
        <Input
          v-model:value='emailAddress' label='MSG_EMAIL_ADDRESS' type='email' id='email'
          :required='signupMethod === appuserbase.SignMethodType.Email' :error='accountError' message='MSG_EMAIL_TIP'
          placeholder='MSG_EMAIL_PLACEHOLDER' @focus='onEmailFocusIn' @blur='onEmailFocusOut'
        />
      </div>
      <slot name='append-account' />
      <Input
        v-model:value='myPassword' label='MSG_PASSWORD' type='password' id='pass'
        required :error='pwdError'
        message='MSG_PASSWORD_TIP' placeholder='MSG_PASSWORD_PLACEHOLDER' @focus='onPasswordFocusIn'
        @blur='onPasswordFocusOut'
      />
      <slot name='append-password' />
    </template>
    <template #append-submit>
      <slot name='append-submit' />
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import { utils, appuserbase } from 'src/npoolstore'
import { defineAsyncComponent, ref, defineProps, toRef, defineEmits, watch, onMounted, computed } from 'vue'

interface Props {
  label: string
  accountType: string
  account: string
  accountError: boolean
  password: string
  submitText: string
  submitting?: boolean
}

const props = defineProps<Props>()
const label = toRef(props, 'label')
const _accountError = toRef(props, 'accountError')

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const PhoneNO = defineAsyncComponent(() => import('src/components/input/PhoneNO.vue'))

const loginWithEmail = computed(() => signupMethod.value === appuserbase.SignMethodType.Email)
const accountError = ref(false)

watch(_accountError, () => {
  accountError.value = _accountError.value
})

const phoneNO = ref('')
const onPhoneNOFocusIn = () => {
  accountError.value = false
}
const onPhoneNOFocusOut = () => {
  accountError.value = !utils.validateMobileNO(phoneNO.value)
}

const emailAddress = ref('')
const onEmailFocusIn = () => {
  accountError.value = false
}
const onEmailFocusOut = () => {
  accountError.value = !utils.validateEmailAddress(emailAddress.value)
}

const myPassword = ref('')
const pwdError = ref(false)
const onPasswordFocusIn = () => {
  pwdError.value = false
}
const onPasswordFocusOut = () => {
  pwdError.value = !utils.validatePassword(myPassword.value)
}

const emit = defineEmits<{(e: 'update:accountType', type: string): void;
  (e: 'update:account', type: string): void;
  (e: 'update:accountError', error: boolean): void;
  (e: 'update:password', type: string): void;
  (e: 'submit'): void;
}>()

const signupMethod = ref(appuserbase.SignMethodType.Email)

const onSwitcherClick = (_signMethod: appuserbase.SignMethodType) => {
  signupMethod.value = _signMethod === appuserbase.SignMethodType.Mobile ? appuserbase.SignMethodType.Email : appuserbase.SignMethodType.Mobile
  accountError.value = false
  emit('update:accountType', signupMethod.value)
  emit('update:account', _signMethod === appuserbase.SignMethodType.Mobile ? phoneNO.value : emailAddress.value)
}

watch(phoneNO, () => {
  emit('update:account', phoneNO.value)
})

watch(emailAddress, () => {
  emit('update:account', emailAddress.value)
})

watch(accountError, () => {
  emit('update:accountError', accountError.value)
})

watch(myPassword, () => {
  emit('update:password', myPassword.value)
})

const onSubmit = () => {
  if (accountError.value || pwdError.value) {
    return
  }
  emit('submit')
  return false
}

onMounted(() => {
  emit('update:accountType', signupMethod.value)
})

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
.email-phone-selector
  margin-top: -8px
</style>
