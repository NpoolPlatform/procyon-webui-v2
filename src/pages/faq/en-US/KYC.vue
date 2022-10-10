<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - KYC</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("How to submit your KYC")'>How to submit your KYC</a></li>
            <li><a @click='scrollTo("How to check the application status")'>How to check the application status</a></li>
            <li>
              <a @click='scrollTo("What should I do if the site crashes in the middle of submission?")'>
                What should I do if the site crashes in the middle of submission?
              </a>
            </li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='KYCの申請の方法'>
            How to submit your KYC
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/80zQV5wLT6Y' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) After logging in, access the <a href='/#/kyc'>Personal Info</a> page.</li>
            <li>(2) Select the "Document Type" you wish to use for KYC submission.</li>
            <ul>
              <li>Passport</li>
              <li>ID Card / Driver's license</li>
            </ul>
            <li>(3) Take a picture of the required images and upload.</li>
            <li>(4) Click the orange "Submit" button at the bottom.</li>
          </ul>

          <h3 id='How to check the application status'>
            How to check the application status
          </h3>

          <ul>
            <li>(1) After logging in, access the <a href='/#/kyc'>Personal Info</a> page.</li>
            <li>(2) Confirm the submission status in the "KYC Verification Status" section of the page.</li>
          </ul>

          <ul>
            <li><strong>Under Review: </strong>Please wait until the status changes to either of the following two. There will be no notification sent upon completion of the review.</li>
            <li><strong>Verified: </strong>The KYC review has been approved.</li>
            <li><strong>Rejected: </strong>The KYC review has been rejected. Please re-apply with reference to the reasons provided.</li>
          </ul>

          <h3 id='What should I do if the site crashes in the middle of submission?'>
            What should I do if the site crashes in the middle of submission?
          </h3>

          <p>Please take the following actions according to the "KYC Verification Status" on the Personal Info page.</p>

          <ul>
            <li><strong>Under Review: </strong>No action required. Your submission has been received. Please wait for the review to be completed. (※ Notification will not be sent upon completion of the review)</li>
            <li><strong>Not Verified: </strong>Please submit your documents again.</li>
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
