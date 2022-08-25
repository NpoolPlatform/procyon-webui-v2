<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - Dashboard</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("How do I check my mining rewards?")'>How do I check my mining rewards?</a></li>
            <li><a @click='scrollTo("What is SMH?")'>What is SMH?</a></li>
            <li>
              <a @click='scrollTo("Why does the amount of SMH rewards change from day to day?")'>
                Why does the amount of SMH rewards change from day to day?
              </a>
            </li>
            <li><a @click='scrollTo("How can I check my order history?")'>How can I check my order history?</a></li>
            <li><a @click='scrollTo("How to export mining data (CSV data)?")'>How to export mining data (CSV data)?</a></li>
            <li><a @click='scrollTo("Why dont numbers change on the dashboard?")'>Why don't numbers change on the dashboard?</a></li>
            <li><a @click='scrollTo("What is the Technical Service Fee?")'>What is the Technical Service Fee?</a></li>
            <li><a @click='scrollTo("What is hashrate?")'>What is hashrate?</a></li>
            <li><a @click='scrollTo("What is Network Daily Output?")'>What is Network Daily Output?</a></li>
            <li><a @click='scrollTo("If Procyons servers go down will the mining stop?")'>If Procyon's servers go down will the mining stop?</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='How do I check my mining rewards?'>
            How do I check my mining rewards?
          </h3>

          <ul>
            <li>(1) Open the <strong>[Dashboard]</strong> page after logging in.</li>
            <li>(2) <strong>[Total Earnings]</strong> and <strong>[Mining Dashboard]</strong> show your mining rewards.</li>
          </ul>

          <h3 id='What is SMH?'>
            What is SMH?
          </h3>

          <p>
            SMH is Spacemesh's native token. When you purchase our SMH mining product, it will begin to mine SMH and
            the daily rewards will be airdropped into your <strong>[Dashboard]</strong> on Procyon.
          </p>

          <h3 id='Why does the amount of SMH rewards change from day to day?'>
            Why does the amount of SMH rewards change from day to day?
          </h3>

          <p>
            The amount of mining rewards varies depending on the mining performance. Differences in performance are
            influenced by market conditions (e.g. the number of miners, mining difficulties etc.).
          </p>

          <h3 id='How can I check my order history?'>
            How can I check my order history?
          </h3>

          <ul>
            <li>(1) Open the <strong>[Dashboard]</strong> page after logging in.</li>
            <li>(2) At the bottom of the page, you can find your <strong>[Order History]</strong>.</li>
          </ul>

          <h3 id='How to export mining data (CSV data)?'>
            How to export mining data (CSV data)?
          </h3>

          <ul>
            <li>(1) Open the <strong>[Dashboard]</strong> page after logging in.</li>
            <li>(2) At the bottom of <strong>[Mining Dashboard]</strong>, click <strong>[Export Daily Output (CSV)]</strong>.</li>
          </ul>

          <h3 id='Why dont numbers change on the dashboard?'>
            Why don't numbers change on the dashboard?
          </h3>

          <p>
            The mining rewards have not been distributed yet because Spacemesh mining has not started. Procyon will update customers about the progress of Spacemesh as soon as information is available.
          </p>

          <h3 id='What is the Technical Service Fee?'>
            What is the Technical Service Fee?
          </h3>

          <p>
            The Technical Service Fee covers the maintenance and operation costs of your mining machine. It is
            automatically deducted from your daily mining rewards.
          </p>

          <h3 id='What is hashrate?？'>
            What is hashrate?
          </h3>

          <p>
            Hashrate is a number that represents the mining speed. The higher the number, the better the mining output.
          </p>

          <h3 id='What is Network Daily Output?'>
            What is Network Daily Output?
          </h3>

          <p>
            The Network Daily Output shows the overall mining volume on the Spacemesh network. This is determined by
            the Spacemesh team.
          </p>

          <h3 id='If Procyons servers go down will the mining stop?'>
            If Procyon's servers go down will the mining stop?
          </h3>

          <p>
            No, mining does not stop even if Procyon's server goes down. The mining is processed at the following data
            centers in United States of America and each center is operating independently, so the mining would continue without
            interruption. The mining itself will not stop however the display of your mining rewards may be down until
            the server recovers.
          </p>
          <p>
            <strong>Data center location: </strong>Dallas, Texas, United States of America
          </p>

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
