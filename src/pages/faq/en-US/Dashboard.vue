<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - Dashboard</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("How do I check my mining rewards?")'>How do I check my mining rewards?</a></li>
            <li><a @click='scrollTo("Which products can I see on my Dashboard?")'>Which products can I see on my Dashboard?</a></li>
            <li><a @click='scrollTo("Why does the amount of rewards change from day to day?")'>Why does the amount of rewards change from day to day?</a></li>
            <li><a @click='scrollTo("How can I check my order history?")'>How can I check my order history?</a></li>
            <li><a @click='scrollTo("How to export mining data (CSV data)?")'>How to export mining data (CSV data)?</a></li>
            <li><a @click='scrollTo("Why dont numbers change on the dashboard?")'>Why don't numbers change on the dashboard?</a></li>
            <li><a @click='scrollTo("What is the Technical Service Fee?")'>What is the Technical Service Fee?</a></li>
            <li><a @click='scrollTo("What is hashrate?")'>What is hashrate?</a></li>
            <li><a @click='scrollTo("What is Network Daily Output?")'>What is Network Daily Output?</a></li>
            <li><a @click='scrollTo("If the website servers go down will the mining stop?")'>If the website servers go down will the mining stop?</a></li>
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

          <h3 id='Which products can I see on my Dashboard?'>
            Which products can I see on my Dashboard?
          </h3>

          <p>Only mining products you have purchase will appear on your <strong>[Dashboard]</strong>. When you purchase a mining product, it will begin to mine tokens and the daily rewards will be airdropped into your <strong>[Dashboard]</strong> on the Platform.</p>

          <h3 id='Why does the amount of rewards change from day to day?'>
            Why does the amount of rewards change from day to day?
          </h3>

          <p>The amount of mining rewards varies depending on the mining performance. Differences in performance are influenced by market conditions (e.g. the number of miners, mining difficulties etc.).</p>

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
            <li>(2) At the bottom of <strong>[Mining Dashboard]</strong>, click [Export Daily Output (CSV)].</li>
          </ul>

          <h3 id='Why dont numbers change on the dashboard?'>
            Why don't numbers change on the dashboard?
          </h3>

          <p>The mining rewards will bring to appear once mining starts for your purchased products. Since our Platform offers first-batch mining, this means you can purchase mining before it can begin. In such cases you have to wait until the mainnet launches and mining can begin.</p>

          <h3 id='What is the Technical Service Fee?'>
            What is the Technical Service Fee?
          </h3>

          <p>The Technical Service Fee covers the maintenance and operation costs of your mining machine. It is automatically deducted from your daily mining rewards.</p>

          <h3 id='What is hashrate?'>
            What is hashrate?
          </h3>

          <p>Hashrate is a number that represents the mining speed. For example, it can be calculated in <strong>[MH/s]</strong>, but the units will vary from token to token. The higher the number, the better the mining output.</p>

          <h3 id='What is Network Daily Output?'>
            What is Network Daily Output?
          </h3>

          <p>The Network Daily Output shows the overall mining volume on the token's network. This is determined by the network itself.</p>

          <h3 id='If the website servers go down will the mining stop?'>
            If the website servers go down will the mining stop?
          </h3>

          <p>No, mining will not stop in the event that the Platform is down.</p>

          <p>Since mining is being carried out at our data center, mining will continue without any problems because the data center and webside server are operating independently.</p>

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
