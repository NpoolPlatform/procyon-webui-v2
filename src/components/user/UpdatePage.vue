<template>
  <FormPage @submit='onSubmit' :label='label' :submit-text='submitText'>
    <template #top-right>
      <slot name='top-right' />
    </template>
    <template #form-body>
      <div class='sent-tip'>
        <p v-html='$t("MSG_VERIFICATION_CODE_SENT_TO", { ACCOUNT: account })' />
      </div>
      <Input
        v-model:value='myVerificationCode'
        :label='accountType === AccountType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
        type='text'
        id='ver-code'
        required
        :error='myVerificationCodeError'
        message='MSG_VERIFICATION_CODE_TIP'
        placeholder='MSG_VERIFICATION_CODE_PLACEHOLDER'
        @focus='onVerificationCodeFocusIn'
        @blur='onVerificationCodeFocusOut'
      />
      <TimeoutSendBtn :initial-clicked='true' @click='onSendCodeClick' />
      <slot name='body' />
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import {
  AccountType,
  MessageUsedFor,
  useCodeRepoStore,
  useLangStore,
  useLoginedUserStore,
  validateVerificationCode,
  NotificationType
} from 'npool-cli-v2'
import { defineAsyncComponent, ref, defineProps, toRef, defineEmits, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  label: string
  accountType: string
  account: string
  verificationCode: string
  verificationCodeError: boolean
  submitText: string
}

const props = defineProps<Props>()
const label = toRef(props, 'label')
const verificationCode = toRef(props, 'verificationCode')
const verificationCodeError = toRef(props, 'verificationCodeError')

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))

const myVerificationCode = ref(verificationCode.value)
const myVerificationCodeError = ref(verificationCodeError.value)
const onVerificationCodeFocusIn = () => {
  myVerificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  myVerificationCodeError.value = !validateVerificationCode(myVerificationCode.value)
}

const coderepo = useCodeRepoStore()
const lang = useLangStore()

const onSendCodeClick = () => {
  if (!myAccount.value?.length) {
    return
  }

  switch (myAccountType.value) {
    case AccountType.Email:
      coderepo.sendEmailCode({
        LangID: lang.CurLang?.ID as string,
        EmailAddress: myAccount.value,
        UsedFor: MessageUsedFor.Update,
        ToUsername: myAccount.value,
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
        PhoneNO: myAccount.value,
        UsedFor: MessageUsedFor.Update,
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

const logined = useLoginedUserStore()
const myAccountType = computed(() => logined.LoginedUser?.User?.EmailAddress?.length ? AccountType.Email : AccountType.Mobile)
const myAccount = computed(() => myAccountType.value === AccountType.Email ? logined.LoginedUser?.User.EmailAddress : logined.LoginedUser?.User.PhoneNO)

const emit = defineEmits<{(e: 'update:accountType', type: string): void,
  (e: 'update:account', type: string): void
  (e: 'update:verificationCode', code: string): void
  (e: 'update:verificationCodeError', error: boolean): void
  (e: 'submit'): void
}>()

watch(myAccount, () => {
  if (!myAccount.value) {
    return
  }
  emit('update:account', myAccount.value)
})

watch(myAccountType, () => {
  emit('update:accountType', myAccountType.value)
})

watch(myVerificationCode, () => {
  emit('update:verificationCode', myVerificationCode.value)
})

watch(myVerificationCodeError, () => {
  emit('update:verificationCodeError', myVerificationCodeError.value)
})

const onSubmit = () => {
  if (myVerificationCodeError.value) {
    return
  }
  emit('submit')
  return false
}

onMounted(() => {
  if (myAccount.value?.length) {
    emit('update:account', myAccount.value)
  }
  emit('update:accountType', myAccountType.value)

  onSendCodeClick()
})

</script>

<style lang='sass' scoped>
.sent-tip
  margin-bottom: 20px
</style>
