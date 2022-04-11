<template>
  <FormPage @submit='onSubmit' :label='label' :submit-text='submitText'>
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
      <slot name='append-account' />
      <Input
        v-model:value='myPassword'
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
      <slot name='append-password' />
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
  validateMobileNO
} from 'npool-cli-v2'
import { defineAsyncComponent, ref, defineProps, toRef, defineEmits, watch, onMounted } from 'vue'

interface Props {
  label: string
  accountType: string
  account: string
  accountError: boolean
  password: string
  submitText: string
}

const props = defineProps<Props>()
const label = toRef(props, 'label')
const _accountError = toRef(props, 'accountError')

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const PhoneNO = defineAsyncComponent(() => import('src/components/input/PhoneNO.vue'))

const accountError = ref(false)

watch(_accountError, () => {
  accountError.value = _accountError.value
})

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

const myPassword = ref('')
const pwdError = ref(false)
const onPasswordFocusIn = () => {
  pwdError.value = false
}
const onPasswordFocusOut = () => {
  pwdError.value = !validatePassword(myPassword.value)
}

const emit = defineEmits<{(e: 'update:accountType', type: string): void,
  (e: 'update:account', type: string): void,
  (e: 'update:accountError', error: boolean): void,
  (e: 'update:password', type: string): void,
  (e: 'submit'): void
}>()

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
  emit('update:accountType', signupMethod.value)
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
</style>
