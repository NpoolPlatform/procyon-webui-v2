<template>
  <FormPage @submit='onSubmit'>
    <template #form-body>
      <label for='email'>{{ $t('MSG_EMAIL_ADDRESS') }}</label>
      <input
        type='email'
        id='email'
        required
        v-model='emailAddress'
        ref='emailInput'
      >
      <q-btn class='send-code alt' @click='onSendCodeClick'>
        {{ $t('MSG_SEND_CODE') }}
      </q-btn>
      <label for='ver-code'>{{ $t('MSG_EMAIL_VERIFICATION_CODE') }}</label>
      <input type='text' id='ver-code' name='ver-code' required>
      <label for='pass'>{{ $t('MSG_PASSWORD') }}</label>
      <input
        type='password'
        id='pass'
        name='password'
        minlength='8'
        required
      >
      <label for='pass'>{{ $t('MSG_CONFIRM_PASSWORD') }}</label>
      <input
        type='password'
        id='pass'
        name='password'
        minlength='8'
        required
        class='error'
      >
      <label for='inv-code'>{{ $t('MSG_INVITATION_CODE') }}</label>
      <input type='text' id='inv-code' name='inv-code' required>
      <input type='checkbox' id='agreement' name='agreement'>
      <label for='agreement' v-html='$t("MSG_READ_AND_AGREE", { POLICY_PATH: "/policy", USER_AGREEMENT: "/agreement" })' />
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
  NotificationType
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const emailAddress = ref('')
const emailInput = ref<HTMLInputElement>()

const coderepo = useCodeRepoStore()
const lang = useLangStore()

const onSendCodeClick = () => {
  if (!validateEmailAddress(emailAddress.value) || !emailInput.value?.checkValidity) {
    emailInput.value?.focus()
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
  console.log('submit')
}

</script>

<style lang='sass' scoped>
.send-code
  width: 100%
  line-height: 1rem
  height: 48px
  border-radius: 18px
  margin-top: 0

.send-code:hover
  border-radius: 4px
</style>
