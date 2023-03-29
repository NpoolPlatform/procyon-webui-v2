<template>
  <Page>
    <template #body>
      <h2>Iron Fish Overview</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Iron Fish Mining")'>Iron Fish Mining</a></li>
            <li><a @click='scrollTo("About Iron Fish")'>About Iron Fish</a></li>
            <li><a @click='scrollTo("Iron Fish Technology")'>Iron Fish Technology</a></li>
            <li><a @click='scrollTo("Why did we choose Iron Fish?")'>Why did we choose Iron Fish?</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Iron Fish Mining'>
            Iron Fish Mining
          </h3>

          <h4>Product Details</h4>

          <p><strong>Start of Mining: </strong>Officially decided and announced by Iron Fish Team. For the latest updates, please join our Sunday Weekly Seminars.</p>

          <p><strong>Mining Period: </strong>365 Days (After Mainnet Launch)</p>

          <p><strong>Technical Service Fee: </strong>20%</p>

          <h3 id='About Iron Fish'>
            About Iron Fish
          </h3>

          <h4>What is Iron Fish?</h4>

          <p>Iron Fish is a Layer 1 blockchain that, like Aleo, that is aiming to become the universal privacy layer for transactions on Web3 by leveraging zk-SNARKs to enable users to have fully private transactions – an element that most current blockchains lack.</p>

          <p>With its decentralized, proof of work (PoW) consensus algorithm and censorship-resistant features, Iron Fish offers easy-to-use, fully-private payments and improves upon the Sapling protocol first created by Zcash to enable even more efficient and secure private transactions.</p>

          <h4>Iron Fish Company Profile</h4>

          <ul>
            <li><strong>Company Name: </strong>Iron Fish</li>
            <li><strong>Location: </strong>San Francisco, California,United States</li>
            <li><strong>Founded: </strong>2018</li>
            <li><strong>Mainnet Launch: </strong>TBD by Iron Fish Team</li>
            <li><a href='https://ironfish.network/docs/whitepaper/1_introduction' target='_blank'>Iron Fish Whitepaper</a></li>
          </ul>

          <h3>Key Members</h3>

          <h4>Elena Nadolinski - Founder</h4>

          <p>After building an impressive resume of over 10 years of software engineering experience at world-leading tech giants Microsoft and AirBNB, Elena recognized the market opportunity for a privacy-focused, easy-to-use blockchain payment system and founded Iron Fish in 2018.</p>

          <h4>Neil Doshi - Head of Content</h4>

          <p>Neil brings rich experience in the blockchain space, having previously been Head of Content at Fantom – a Layer 1 blockchain whose token is in the top 50 by market capitalization. After finishing his PhD at Michigan State University, Neil dedicated himself to breaking down highly complex blockchain information into easy to understand, consumer-facing content.</p>

          <h4>Iron Fish Team</h4>

          <p>Iron Fish’s team members have decades of experience between them, building top-tier products such as AirBNB, Facebook, Google, Uber, and more. Alongside Elena and Neil are a team of 14 with 12 engineers and an award-winning designer and a crypto-native community manager to facilitate the development and growth of the Iron Fish ecosystem.</p>

          <h3 id='Iron Fish Technology'>
            Iron Fish Technology
          </h3>

          <p>Privacy-focused blockchains before 2023 all have drawbacks in terms of privacy, accessibility, or both. Iron Fish does not compromise on privacy, while still being extremely easy to use.</p>

          <p>The application layer is written in Typescript, a popular programming language, which allows for simple end-user integrations and interactions.</p>

          <p>The key innovation of Iron Fish is the way it provides full privacy while still being compliant with government regulations. Zcash and Monero are 100% private, meaning criminals can conduct money laundering and other illicit transactions on those chains.</p>

          <p>With Iron Fish, all transactions are 100% private by default, but any user can give a third party, for example a government auditor, a view key which allows only the view key holder to see the user’s transactions.</p>

          <p>In this way, Iron Fish users can rest assured that they will be able to fully comply with any financial audits or anti-money laundering (AML) investigations while maintaining daily privacy for transactions.</p>

          <h3 id='Why did we choose Iron Fish?'>
            Why did we choose Iron Fish?
          </h3>

          <p>Some of the biggest and most influential Web3 VC funds and Angel Investors have seen the potential of Iron Fish and invested heavily into its development.</p>

          <p>The first Angel investment round raised $5.3M at an estimated $50~80M valuation, led by renowned Web2 / Web3 VC Slow Ventures and Balaji Srinivasan – former General Partner at a16z and former CTO at Coinbase.</p>

          <p>A later round raised $27M at an estimated $150~300M valuation, and was led by a16z and joined by some of the world’s top VCs such as Sequoia, MetaStable, Electric Capital, and Arrington Capital, as well as other Angel investors including Dylan Field (co-founder of Figma), Alan Howard (British billionaire hedge fund manager), Jeff Weiner (LinkedIn Executive), Divesh Makan (Partner at Iconiq Capital), and more!</p>

          <p>a16z felt so strongly about their investment that they wrote an <a href='https://a16z.com/2021/11/30/investing-in-iron-fish/' target='_blank'>article on November 30, 2021 highlighting the great aspects of Iron Fish and why they believe it will succeed</a>.</p>

          <p>While Iron Fish does have technology that competes with Procyon’s other offering of Aleo, we are very bullish about zero knowledge for Web3.</p>

          <p>Thus, we want to bring a diverse portfolio of products to our community. The expectation is for zero knowledge to be a major part of blockchain projects from now into the future.</p>

          <p>The core difference between Aleo and Iron Fish it that Aleo has programmability for applications, NFTs, games, and more from the start of its mainnet. However, Iron Fish will use a Layer 2, the Ethereum Virtual Machine, for future programmability.</p>

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
