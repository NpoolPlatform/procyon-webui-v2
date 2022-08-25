<template>
  <Page>
    <template #body>
      <h2>Spacemesh Overview</h2>
      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Spacemesh mining")'>Spacemesh mining</a></li>
            <li><a @click='scrollTo("About Spacemesh")'>About Spacemesh</a></li>
            <li><a @click='scrollTo("Spacemesh technology (DAG structure)")'>Spacemesh technology (DAG structure)</a></li>
            <li><a @click='scrollTo("Why did procyon choose Spacemesh?")'>Why did procyon choose Spacemesh?</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Spacemesh Mining'>
            Spacemesh mining
          </h3>

          <h4>Product Detail</h4>

          <p><strong>Start of Mining: </strong>At the launch of the mainnet (scheduled between December 5th 2022 ~ December 12th 2022)</p>

          <p><strong>Mining Period: </strong>365 days (after mainnet launch)</p>

          <p><strong>Technical Service Fee: </strong>20%</p>

          <p><strong>Mining Algorithms: </strong>PoST Mining (rewards are distributed based on the amount of unused hard drive space and time provided)</p>

          <h3 id='About Spacemesh'>
            About Spacemesh
          </h3>

          <h4>What is Spacemesh?</h4>

          <p>Cypto project to propose a solution to traditional blockchain developed and operated by Unruly Technologies Ltd.</p>

          <h4>Spacemesh Company Profile</h4>

          <ul>
            <li><strong>Company Name: </strong>Unruly Technologies Ltd</li>
            <li><strong>Location: </strong>Israel</li>
            <li><strong>Founded: </strong>March 20, 2018</li>
            <li><strong>Start of Project: </strong>Q4 2017</li>
            <li><strong>Start of Testnet: </strong>Q3 2019</li>
            <li><strong>Mainnet Launch: </strong>2022/12/5 ~ 2022/12/12 (<a href='https://procyon-vip.medium.com/spacemesh%E9%80%B2%E6%8D%97%E6%83%85%E5%A0%B1%E3%81%BE%E3%81%A8%E3%82%81-vol-5-197a9b424a87' target='_blank'>Announced by Spacemesh Official</a>)</li>
            <li><a href='https://spacemesh.io/blog/spacemesh-white-paper-1/' target='_blank'>Spacemesh Whitepaper</a></li>
          </ul>

          <h4>Co-Founders of Spacemesh</h4>

          <h4>Tomer Afek</h4>

          <p>Tomer Afek is currently the CEO &amp; Co-founder of Spacemesh, and has spent over 3 decades focusing on start up investments. He has also cofounded Convert Media, a large data startup (acquired by taboola) as well as spending 7 years as an Investor at Evergreen Capital, which is one of the oldest, and largest venture capital firms in Israel.</p>

          <h4>Aviv Eyal</h4>

          <p>Aviv Eyal is a Co-founder of Spacemesh and has held several CTO positions in innovative startup companies related to media & the blockchain industry. He has also grown two successful consumer media startups in San Francisco and New York, and he is also the co-founder of Cackle.com which was acquired by Sony.</p>

          <h3 id='Spacemesh technology (DAG structure)'>
            Spacemesh technology (DAG structure)
          </h3>

          <p>Spacemesh is a decentralized platform based on a blockmesh structure using the Proof of SpaceTime (PoST) protocol. Instead of blocks being generated one at a time, Spacemesh miners generate multiple blocks in parallel and they can all be accepted as valid blocks creating a mesh structure. It is one of the DAG (Directed Acyclic Graph) structures that is gaining recognition as an alternative solution to the problems of blockchain in distributed ledger technology. It is also known as the most decentralized and fair cryptocurrency network in the world.</p>

          <h3 id='Why did procyon choose Spacemesh?'>
            Why did procyon choose Spacemesh?
          </h3>

          <p>In terms of VC investments, Spacemesh has more support than Chia, despite the fact that the two projects are considered very similar.</p>

          <p>Spacemesh's team is highly qualified and has a comprehensive strategy on how the service will be delivered to customers.</p>

          <p>On the technical side, Spacemesh's smart contract language is greatly simplified for developers to use, making the transaction process much faster than Chia.</p>

          <p>In terms of Spacemesh's future ecosystem, significant projects on Layer 2 such as Solana and Polkadot will be developed on the Spacemesh blockchain. And regarding the payment methods, it will partner with various payment platforms to drive growth of the ecosystem.</p>

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
