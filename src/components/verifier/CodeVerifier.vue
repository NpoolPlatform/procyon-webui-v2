<template>
  <div class='form-container content-glass'>
    <div class='confirmation'>
      <h3>{{ $t(title) }}</h3>
      <div>
        <span>{{ $t(caption) }}</span>
      </div>
      <div v-if='myVerifyMethod !== appuserbase.SigninVerifyType.Google'>
        <p
          class='tip'
          v-if='myVerifyMethod === appuserbase.SigninVerifyType.Email'
          v-html='$t("MSG_VERIFICATION_CODE_SENT_TO", { ACCOUNT: account })'
        />
        <p
          class='tip'
          v-if='myVerifyMethod === appuserbase.SigninVerifyType.Mobile'
          v-html='$t("MSG_VERIFICATION_CODE_SENT_TO", { ACCOUNT: account })'
        />
      </div>
      <Input
        v-model:value='myCode'
        type='text'
        id='address'
        required
        :error='codeError'
        message='MSG_VERIFICATION_CODE_TIP'
        placeholder='MSG_VERIFICATION_CODE_PLACEHOLDER'
        :autocomplete='false'
        @focus='onCodeFocusIn'
        @blur='onCodeFocusOut'
      />
      <TimeoutSendBtn
        v-if='myVerifyMethod !== appuserbase.SigninVerifyType.Google'
        :initial-clicked='true'
        @click='onSendCodeClick'
        class='margin-top-0'
        :target-error='false'
      />
      <button class='btn' @click='onVerifyClick' :disabled='disabled || !utils.validateVerificationCode(myCode)'>
        {{ $t('MSG_VERIFY') }}
      </button>
      <button v-if='showCancel' class='send-code alt' @click='onCancelClick' :disabled='disabled'>
        {{ $t('MSG_CANCEL') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, defineEmits, computed, watch, onMounted, ref, defineAsyncComponent } from 'vue'
import { user, basetypes, utils, appuserbase, notifverify } from 'src/npoolstore'

const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

interface Props {
  verifyMethod?: appuserbase.SigninVerifyType
  usedFor: basetypes.EventType
  toUsername?: string
  account: string
  accountType: appuserbase.SignMethodType
  disabled?: boolean
  showCancel?: boolean
}

const props = defineProps<Props>()
const verifyMethod = toRef(props, 'verifyMethod')
const usedFor = toRef(props, 'usedFor')
const toUsername = toRef(props, 'toUsername')
const disabled = toRef(props, 'disabled')
const showCancel = toRef(props, 'showCancel')

const logined = user.useLocalUserStore()

const myVerifyMethod = computed(() => {
  if (verifyMethod.value?.length) {
    switch (verifyMethod.value) {
      case appuserbase.SigninVerifyType.Mobile:
      case appuserbase.SigninVerifyType.Email:
      case appuserbase.SigninVerifyType.Google:
        return verifyMethod.value
    }
  }
  if (logined.User?.GoogleAuthVerified) {
    return appuserbase.SigninVerifyType.Google
  }
  if (logined.User?.EmailAddress?.length) {
    return appuserbase.SigninVerifyType.Email
  }
  return appuserbase.SigninVerifyType.Mobile
})

const title = computed(() => {
  switch (myVerifyMethod.value) {
    case appuserbase.SigninVerifyType.Mobile:
      return 'MSG_MOBILE_VERIFICATION'
    case appuserbase.SigninVerifyType.Email:
      return 'MSG_EMAIL_VERIFICATION'
    case appuserbase.SigninVerifyType.Google:
      return 'MSG_GOOGLE_VERIFICATION'
    default:
      break
  }
  return 'MSG_EMAIL_VERIFICATION'
})
const account = computed(() => {
  switch (myVerifyMethod.value) {
    case appuserbase.SigninVerifyType.Mobile:
      return logined.User?.PhoneNO
    case appuserbase.SigninVerifyType.Email:
      return logined.User?.EmailAddress
    case appuserbase.SigninVerifyType.Google:
      return ''
    default:
      break
  }
  return logined.User?.EmailAddress
})
const caption = computed(() => {
  switch (myVerifyMethod.value) {
    case appuserbase.SigninVerifyType.Mobile:
      return 'MSG_MOBILE_VERIFICATION_CAPTION'
    case appuserbase.SigninVerifyType.Email:
      return 'MSG_EMAIL_VERIFICATION_CAPTION'
    case appuserbase.SigninVerifyType.Google:
      return 'MSG_GOOGLE_VERIFICATION_CAPTION'
    default:
      break
  }
  return 'MSG_EMAIL_VERIFICATION_CAPTION'
})

const myCode = ref('')
const codeError = ref(false)
const onCodeFocusIn = () => {
  codeError.value = false
}
const onCodeFocusOut = () => {
  codeError.value = !utils.validateVerificationCode(myCode.value)
}

const emit = defineEmits<{(e: 'update:account', account: string): void;
  (e: 'update:accountType', code: string): void;
  (e: 'update:verifyMethod', method: string): void;
  (e: 'verify', code: string): void;
  (e: 'cancel'): void;
}>()

watch(myVerifyMethod, () => {
  emit('update:verifyMethod', myVerifyMethod.value)
  emit('update:accountType', myVerifyMethod.value)
})
watch(account, () => {
  emit('update:account', account.value)
})

const onVerifyClick = () => {
  codeError.value = !utils.validateVerificationCode(myCode.value)
  if (codeError.value) {
    return
  }
  emit('verify', myCode.value)
}

const onCancelClick = () => {
  emit('cancel')
}

const verify = notifverify.useVerifyStore()
const onSendCodeClick = () => {
  verify.sendVerificationCode(account.value, myVerifyMethod.value, usedFor.value, toUsername.value?.length ? toUsername.value : account.value)
}

onMounted(() => {
  onSendCodeClick()
  emit('update:account', account.value)
  emit('update:accountType', myVerifyMethod.value)
})

</script>

<style lang='sass' scoped>
.margin-top-0
  margin-bottom: 36px !important

.tip
  margin-bottom: 0
  margin-top: 24px
  font-size: 14px
</style>
