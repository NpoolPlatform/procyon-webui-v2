<template>
  <BackPage>
    <div class='content'>
      <h2>{{ $t('MSG_CONTACT_SUPPORT') }}</h2>
    </div>
    <div class='content contact-page'>
      <div class='form-container content-glass'>
        <h3 class='form-title'>
          {{ $t('MSG_CONTACT_VIA_EMAIL') }}
        </h3>
        <form action='javascript:void(0)' @submit='onSubmit'>
          <label for='email'>{{ $t('MSG_EMAIL_ADDRESS') }}</label>
          <input type='email' id='email' required v-model='sender'>
          <label for='name'>{{ $t('MSG_CONTACT_NAME') }}</label>
          <input
            type='text'
            id='name'
            name='name'
            required
            v-model='senderName'
          >
          <label for='subject'>{{ $t('MSG_SUBJECT') }}</label>
          <input
            type='text'
            id='subject'
            name='subject'
            required
            v-model='subject'
          >
          <label for='message'>{{ $t('MSG_MESSAGE') }}</label>
          <textarea
            type='text'
            id='message'
            name='message'
            required
            v-model='body'
          />
          <input type='submit' :value='$t("MSG_SEND_MESSAGE")' class='register'>
        </form>
      </div>
      <div class='form-container content-glass'>
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
  </BackPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { contact, basetypes, notify } from 'src/npoolstore'

import lineQr from '../../assets/line-qr.png'

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const _contact = contact.useContactStore()
const router = useRouter()

const sender = ref('')
const subject = ref('')
const body = ref('')
const senderName = ref('')

const onSubmit = () => {
  _contact.contactVIAEmail({
    UsedFor: basetypes.EventType.Contact,
    Sender: sender.value,
    Subject: subject.value,
    Body: body.value,
    SenderName: senderName.value,
    Message: {
      Error: {
        Title: 'MSG_SEND_EMAIL',
        Message: 'MSG_SEND_EMAIL_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    void router.push({ path: '/' })
  })
}

</script>
