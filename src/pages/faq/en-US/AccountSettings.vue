<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - Account Settings</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Change account details")'>Change account details (name, address, user name)</a></li>
            <li><a @click='scrollTo("How to bind your mobile number to your account")'>How to bind your mobile number to your account</a></li>
            <li><a @click='scrollTo("How to dind two-factor authentication")'>How to dind two-factor authentication (Google Authenticator)</a></li>
            <li><a @click='scrollTo("Login using Google Authenticator")'>Login using Google Authenticator</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Change account details'>
            Change account details (name, address, user name)
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/q3FLVYDtlaQ'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the <strong>[Account]</strong> page after logging in.</li>
            <li>(2) Click on the account details and edit the information.</li>
            <li>(3) After entering your new account information click <strong>[Save]</strong>.</li>
          </ul>

          <h3 id='How to bind your mobile number to your account'>
            How to bind your mobile number to your account
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/SFIiq9SdNXA'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the [Security] page after logging in.</li>
            <li>(2) Click the [Not Verified] button.</li>
            <li>(3) Enter your phone number. *Do not enter the first '0'.</li>
            <li>(4) Click [Send Code].</li>
            <li>(5) Enter the verification code sent to your phone.</li>
            <li>(6) Click the [Setup Mobile Number] button.</li>
          </ul>

          <h3 id='How to bind two-factor authentication'>
            How to bind two-factor authentication (Google Authenticator)
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/-ZhLnqi2ESI'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open <strong>[Security]</strong> page after logging in.</li>
            <li>(2) Click <strong>[Setup Two-Factor Auth]</strong>.</li>
            <li>(3) Scan the QR code via the Google Authenticator app.</li>
            <li>*Click below to install the Google Authenticator app.</li>
            <ul>
              <li><a href='https://apps.apple.com/jp/app/google-authenticator/id388497605' target='_blank'>For iOS (iPhone)</a></li>
              <li><a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ja&gl=US' target='_blank'>For Android</a></li>
            </ul>
            <li>(4) Click [Next Step] on Procyon.vip.</li>
            <li>(5) Enter the authentication code from Google Authenticator on Procyon.vip to complete the two-factor setup.</li>
          </ul>

          <h3 id='Login using Google Authenticator'>
            Login using Google Authenticator
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/uZnoRTd6L4w'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open <strong>[Security]</strong> page after login.</li>
            <li>(2) Click <strong>[Google Login Authentication]</strong> in the <strong>[Login Verification]</strong>section.</li>
            <li>*Please confirm that <strong>[Google Login Authentication]</strong> is highlighted green.</li>
            <li>(3) Click the <strong>[Submit Change]</strong> button.</li>
          </ul>

          <div class='hr' />
        </div>
      </div>
    </template>
  </Page>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { scrollTo } from 'src/utils/scroll'

const Page = defineAsyncComponent(() => import('src/pages/faq/Page.vue'))

</script>
