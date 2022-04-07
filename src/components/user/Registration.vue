<template>
  <FormPage>
    <template #form-body>
      <label for='email'>E-mail Address</label>
      <input type='email' id='email' required>
      <input type='submit' value='Send Code' class='send-code'>
      <label for='ver-code'>E-mail Verification Code</label>
      <input type='text' id='ver-code' name='ver-code' required>
      <label for='pass'>Password</label>
      <input
        type='password'
        id='pass'
        name='password'
        minlength='8'
        required
      >
      <label for='pass'>Confirm Password</label>
      <input
        type='password'
        id='pass'
        name='password'
        minlength='8'
        required
        class='error'
      >
      <label for='inv-code'>Invitation Code</label>
      <input type='text' id='inv-code' name='inv-code' required>
      <input type='checkbox' id='agreement' name='agreement'>
      <label for='agreement'>I have read and agree to the <a href=''>Privacy Policy</a> and <a href=''>User Agreements</a></label>

      <input type='submit' value='Register' class='register'>
      <p class='skip-registration'>
        Already have an account? <a href=''>Click here to sign in.</a>
      </p>
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))

</script>
