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
            KYCの申請の方法
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/80zQV5wLT6Y'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1) Open the <a href='https://www.procyon.vip/#/kyc'><strong>[KYC]</strong></a> page after logging in.</li>
            <li>(2) Select the <strong>[type of identification]</strong> from the list below:</li>
            <ul>
              <li>Passport</li>
              <li>ID Card (for Driver's License, please select ID Card)</li>
            </ul>
            <li>(3) Follow the instructions and upload all required pictures.</li>
            <li>(4) Click the <strong>[Submit Documents]</strong> button.</li>
          </ul>

          <h3 id='How to check the application status'>
            How to check the application status
          </h3>

          <ul>
            <li>(1) Open the <a href='https://www.procyon.vip/#/kyc'><strong>[KYC]</strong></a> page after logging in.</li>
            <li>(2) You can check the status under <strong>[KYC Verification Status]</strong>.</li>
          </ul>

          <ul>
            <li>
              <strong>[Under Review] </strong>Please wait until the status changes to either of the following below.
              (Note: email notification is NOT sent when status is changed.)
            </li>
            <li><strong>[Verified] </strong>The KYC process has been successfully completed.</li>
            <li><strong>[Rejected] </strong>The KYC application has been rejected. Please re-apply according to the reasons provided.</li>
          </ul>

          <h3 id='What should I do if the site crashes in the middle of submission?'>
            What should I do if the site crashes in the middle of submission?
          </h3>

          <p>Please re-open the KYC page and follow the steps below based on the <strong>[KYC Verification Status]</strong>.</p>

          <ul>
            <li>
              <strong>[Under Review] </strong>Please wait until the status changes to either of the following below.
              (Note: email notification is NOT sent when status is changed.)
            </li>
            <li><strong>[Not Verified] </strong>Please re-submit your application.</li>
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
