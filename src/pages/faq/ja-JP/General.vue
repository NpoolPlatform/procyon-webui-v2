<template>
  <Page>
    <template #body>
      <h2>Procyon プラットフォーム：総合案内</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>目次</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Procyonはスマホアプリもありますか？")'>Procyonはスマホアプリもありますか？</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Procyonはスマホアプリもありますか？'>
            Procyonはスマホアプリもありますか？
          </h3>

          <p>2022年4月、ブラウザベースのウェブサイト（スマホからも閲覧可能）のみで展開しています。</p>

          <p>将来的には、プラットフォームの公式モバイルアプリを立ち上げる予定があります。</p>

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
