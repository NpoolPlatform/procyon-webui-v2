<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - Login</h2>
      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("How to login")'>How to login</a></li>
            <li><a @click='scrollTo("How to login for the first time")'>How to login for the first time</a></li>
            <li><a @click='scrollTo("Forgot your password?")'>Forgot your password?</a></li>
            <li><a @click='scrollTo("Change/reset your password")'>Change/reset your password</a></li>
            <li><a @click='scrollTo("How to check your login history")'>How to check your login history</a></li>
            <li><a @click='scrollTo("What is an invitation code?")'>What is an invitation code?</a></li>
            <li><a @click='scrollTo("I have not received my verification code")'>I have not received my verification code</a></li>
          </ul>
          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='How to login'>
            How to login
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/CSeoLtAPOR0'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the <strong>[Login]</strong> page, enter your registered email address/password.</li>
            <li>(2) Click the <strong>[Login]</strong> button at the bottom of the screen.</li>
            <li>(3) <strong>[Enter the verification code]</strong> either from your registered email address or from Google Authenticator.</li>
          </ul>

          <h4>If it does not proceed from the verification screen</h4>
          <p>The email address or the password is incorrect.</p>
          <p>Please re-confirm your account details and try again.</p>

          <h4>If it fails to login after entering the verification code</h4>
          <p>The verification code is incorrect. Please make sure you use the code within the specified time.</p>

          <p>For email verification, please re-confirm the code in your inbox.</p>
          <p>If you are using Google Authenticator, please enter the verification code that is being displayed.</p>

          <h3 id='How to login for the first time'>
            How to login for the first time
          </h3>
          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/s9bNxlU7JVs'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <p><strong>Users are asked to change their password when first logging in to Procyon.vip.</strong> From the second time, you will be able to login normally.</p>

          <h4>Reset Your Password</h4>
          <ul>
            <li>(1) Open the <strong>[Login]</strong> page.</li>
            <li>(2) Click <strong>[Forgot password?]</strong> in green.</li>
            <li>(3) Enter your email address (the one you submitted when you placed your order), and click <strong>[Send Code]</strong>.</li>
            <li>(4) Enter the verification code sent to your email.</li>
            <li>(5) Set your new password and click the <strong>[Confirm]</strong> button.</li>
          </ul>

          <h4>Login Process</h4>
          <ul>
            <li>(1) Open the <strong>[Login]</strong> page, then enter the registered email address/password.</li>
            <li>(2) Click the <strong>[Login]</strong> button.</li>
            <li>(3) Enter the verification code sent to your email address.</li>
          </ul>

          <h3 id='Forgot your password?'>
            Forgot your password?
          </h3>
          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/s9bNxlU7JVs'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the <strong>[Login]</strong> page.</li>
            <li>(2) Click the <strong>[Forgot password?]</strong> link.</li>
            <li>(3) Enter the email address you registered for this account and click <strong>[Send Code]</strong>.</li>
            <li>(4) Enter the verification code sent to your email.</li>
            <li>(5) Set your new password and click the <strong>[Confirm]</strong> button.</li>
          </ul>

          <h3 id='Change/reset your password'>
            Change/reset your password
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/bMWoc0qflwI'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the <strong>[Security]</strong> page after login.</li>
            <li>(2) Click <strong>[Change Password]</strong>.</li>
            <li>(3) Click <strong>[Send Code]</strong> in the <strong>[Verification Code]</strong> section.</li>
            <li>(4) Enter the verification code sent to your registered email address.</li>
            <li>(5) Enter your old password, then enter/re-enter your new password.</li>
            <li>(6) Click the <strong>[Confirm]</strong> button.</li>
          </ul>

          <h3 id='How to check your login history'>
            How to check your login history
          </h3>

          <ul>
            <li>(1) Open the <strong>[Security]</strong> page after login.</li>
            <li>(2) Scroll down and confirm your <strong>[Login History]</strong> at the bottom of the page.</li>
          </ul>

          <p>If an unknown login is detected, please contact <a href='mailto:support@procyon.vip'>support@procyon.vip</a></p>

          <h3 id='What is an invitation code?'>
            What is an invitation code?
          </h3>

          <p>An invitation code is sent to selected individuals and is required for account registration. If you do not have an invitation code you cannot make an account on Procyon Platform. Please do not contact us to request an invitation code.</p>

          <h3 id='I have not received my verification code'>
            I have not received my verification code
          </h3>

          <p>The verification code sent to your email address may not be received due to email account settings.</p>

          <p>Please try the following:</p>

          <ul>
            <li>(1) Check your spam folder.</li>
            <li>(2) Search your inbox using the following subject and address:</li>
            <ul>
              <li><strong>Subject:</strong>Procyon.vip - Email verification code</li>
              <li><strong>Email Address: </strong>support@procyon.vip</li>
            </ul>
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
