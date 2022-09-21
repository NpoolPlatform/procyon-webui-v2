<template>
  <Page>
    <template #body>
      <h2>Aleo Overview</h2>
      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Aleo Mining")'>Aleo Mining</a></li>
            <li><a @click='scrollTo("About Aleo")'>About Aleo</a></li>
            <li><a @click='scrollTo("Aleo Technology")'>Aleo Technology</a></li>
            <li><a @click='scrollTo("Why did Procyon choose Aleo?")'>Why did Procyon choose Aleo?</a></li>
            <li><a @click='scrollTo("Can anyone purchase Aleo Mining?")'>Can anyone purchase Aleo Mining?</a></li>
            <li><a @click='scrollTo("When is the deadline to purchase Aleo Mining?")'>When is the deadline to purchase Aleo Mining?</a></li>
            <li><a @click='scrollTo("Is the mainnet launch date confirmed?")'>Is the mainnet launch date confirmed?</a></li>
            <li><a @click='scrollTo("Why is there an extra 10% fee added when I purchase Aleo Mining with BTC?")'>Why is there an extra 10% fee added when I purchase Aleo Mining with BTC?</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Aleo Mining'>
            Aleo Mining
          </h3>

          <h4>Product Details</h4>

          <p><strong>Start of Mining: </strong>At the launch of the mainnet (predicted December 2022, Aleo has not announced an official date)</p>

          <p><strong>Mining Period: </strong>365 days (after mainnet launch)</p>

          <p><strong>Technical Service Fee: </strong>20%</p>

          <h3 id='About Aleo'>
            About Aleo
          </h3>

          <h4>What is Aleo?</h4>

          <p>A Layer 1 Crypto project developed and operated by Aleo Systems Inc focusing on Web3 privacy and offering a solution to various issues of traditional blockchains.</p>

          <h4>Aleo Company Profile</h4>

          <ul>
            <li><strong>Company Name: </strong>Aleo Systems Inc.</li>
            <li><strong>Location: </strong>Reno, Nevada, United States</li>
            <li><strong>Founded: </strong>2019</li>
            <li><strong>Start of Testnet 1: </strong>Q1, 2021</li>
            <li><strong>Start of Testnet 2: </strong>December 6, 2021</li>
            <li><strong>Start of Testnet 3: </strong>August 2, 2022</li>
            <li><strong>Predicted Mainnet Launch: </strong>December 2022 (Aleo has not announced an official date)</li>
            <li><a href='https://www.aleo.org/post/aleo-token-economics' target='_blank'>Aleo Token Economics</a></li>
          </ul>

          <h3>Co-Founders of Aleo</h3>

          <h4>Howard Hu</h4>

          <p>A former engineer at Google after graduating from UC Berkeley. Worked in Blockchain at Berkeley (a blockchain accelerator at Berkeley University) and Dekrypt Capital for over 10 years.</p>

          <h4>Collin Chin</h4>

          <p>Interned as a smart contract developer at ConsenSys while at Berkeley. Worked as a technical advisor and security consultant at Blockchain at Berkeley and Argus.</p>

          <h4>Raymond Chu</h4>

          <p>While at Berkeley, interned as an engineer at IBM and Amazon. After graduation, worked as a project manager and security consultant at Blockchain at Berkeley and Argus.</p>

          <h4>Michael Beller</h4>

          <p>Senior Manager at Accenture for 7 years. Served as COO/CIO in numerous IT/financial startups.</p>

          <h3 id='Aleo Technology'>
            Aleo Technology
          </h3>

          <h4>Aleo is the first platform to offer fully private applications.</h4>

          <p>Aleo achieves privacy by leveraging decentralized systems and zero-knowledge cryptography to protect user data on the web. Using zero-knowledge cryptography, Aleo moves smart contract execution off-chain to enable a diverse range of decentralized applications that are both entirely private and can scale to tens of thousands of transactions per second. Built on an open, public blockchain, Aleo brings all the flexibility of Ethereum but with a more scalable architecture in which miners don’t need to re-run every transaction, but simply verify their correctness.</p>

          <h3 id='Why did Procyon choose Aleo?'>
            Why did Procyon choose Aleo?
          </h3>

          <p>Aleo raised approximately $228 million in just two funding rounds, bringing its pre-listing valuation to approximately $1.45 billion. The funding stands as the largest fundraising round ever in the zero-knowledge industry.</p>

          <p>Institutional investors in Aleo include Japanese investment fund Softbank Vision, industry leader a16z, Polychain Capital, exchange Coinbase, and others who have high expectations for the project and are backing it.</p>

          <p>It is very rare that the Softbank Vision Fund invests in a crypto project. SoftBank Vision Fund has not only invested in Aleo, but it also serves as a member of Aleo's board of directors.</p>

          <p>Aleo's team is highly qualified and has a comprehensive strategy on how the service will be delivered to customers.</p>

          <p>On the technical side, Aleo offers one of the most important infrastructures of Web3’s future with its zero-knowledge proof – using ZKPs to achieve both privacy and programmability.</p>

          <p>In terms of Aleo's future ecosystem, Aleo has the potential to be the next Ethereum or Solana through its Layer 1 technology. Various applications will be developed on top of Aleo, as we have already seen with the strategic partnership with Forte - the gaming company. Aleo aims to become the solution to Web2's major drawbacks such as data leaks, private data monetization, and the permanent availability of leaked data.</p>

          <h3 id='Can anyone purchase Aleo Mining?'>
            Can anyone purchase Aleo Mining?
          </h3>

          <p>Our platform is invitation-only, so only selected communities will be invited to the platform. Anyone with a registered account on our platform will be able to make Aleo purchases.</p>

          <h3 id='When is the deadline to purchase Aleo Mining?'>
            When is the deadline to purchase Aleo Mining?
          </h3>

          <p>As of 2022-09-20, the Aleo First Batch Mining purchase deadline is 2022-11-20.</p>

          <h3 id='Is the mainnet launch date confirmed?'>
            Is the mainnet launch date confirmed?
          </h3>

          <p>Like the majority of cryptocurrency projects, Aleo has set a roadmap for themselves and continues to push forward. As of the launch of their testnet 3, Aleo will launch when this testnet is completed. The exact launch date will fully depend on Aleo's readiness to transition to the mainnet. We will continue to update our community as we are updated. Also, please continue to stay updated by reading Aleo's twitter.</p>

          <h3 id='Why is there an extra 10% fee added when I purchase Aleo Mining with BTC?'>
            Why is there an extra 10% fee added when I purchase Aleo Mining with BTC?
          </h3>

          <p>When customers pay with BTC, we add an extra fee of about 10% to the USDT/BTC exchange rate to avoid shortfalls due to BTC price fluctuations.</p>

          <p>This is necessary to hedge the risk of BTC volatility and is not intended to make additional profit for the platform.</p>

          <p>Since we pay for all hardware and staff costs in USD, we set the price of our mining products in a stable coin (USDT).</p>

          <p>If payment are received in BTC, the BTC price may experience large fluctuations before it can be converted to USDT, which may results in singnificant losses. Therefore, we accept payments in BTC for our clients' convenience but, <strong>we encourage all buyers to make purchases with USDT</strong>.</p>

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
