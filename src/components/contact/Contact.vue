<template>
  <div class='back-button'>
    ⭠
  </div>
  <div class='content'>
    <h2>{{ $t('MSG_CONTACT_SUPPORT') }}</h2>
  </div>
  <div class='content contact-page'>
    <div class='form-container'>
      <h3 class='form-title'>
        {{ $t('MSG_CONTACT_VIA_EMAIL') }}
      </h3>
      <form action=''>
        <label for='email'>{{ $t('MSG_EMAIL_ADDRESS') }}</label>
        <input type='email' id='email' required>
        <label for='name'>{{ $t('MSG_NAME') }}</label>
        <input type='text' id='name' name='name' required>
        <label for='subject'>{{ $t('MSG_SUBJECT') }}</label>
        <input type='text' id='subject' name='subject' required>
        <label for='message'>{{ $t('MSG_MESSAGE') }}</label>
        <textarea type='text' id='message' name='message' required />
        <input type='submit' :value='$t("MSG_SEND_MESSAGE")' class='register'>
      </form>
    </div>
    <div class='form-container'>
      <h3 class='form-title'>
        {{ $t('MSG_CONTACT_VIA_LINE') }}
      </h3>
      <p class='qr-code-text' v-html='$t("MSG_CONTACT_VIA_LINE_1")' />
      <div class='qr-code-container'>
        <img :src='lineQr'>
      </div>
      <p class='qr-code-text' v-html='$t("MSG_CONTACT_VIA_LINE_2")' />
      <h4 id='signature'>
        {{ $t('MSG_CONTACT_SIGNATURE') }}
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>

import lineQr from '../../assets/line-qr.png'

</script>
