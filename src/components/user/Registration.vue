<template>
  <FormPage>
    <template #form-body>
      <label for='email'>{{ $t('MSG_EMAIL_ADDRESS') }}</label>
      <input type='email' id='email' required>
      <input type='submit' :value='$t("MSG_SEND_CODE")' class='send-code'>
      <label for='ver-code'>E-mail Verification Code</label>
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
import { defineAsyncComponent } from 'vue'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))

</script>
