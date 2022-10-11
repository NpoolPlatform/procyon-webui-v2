<template>
  <Page>
    <template #body>
      <h2>Procyon プラットフォーム：総合案内</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>ナビゲーション</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Procyonはスマホアプリもありますか？")'>Procyonはスマホアプリもありますか？</a></li>
            <li><a @click='scrollTo("ブログの確認方法")'>ブログの確認方法</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Procyonはスマホアプリもありますか？'>
            Procyonはスマホアプリもありますか？
          </h3>

          <p>2022年10月現在、ブラウザベースのウェブサイト（スマホからも閲覧可能）のみで展開しています。</p>

          <p>将来的には、プラットフォームの公式モバイルアプリを立ち上げる予定があります。</p>

          <h3 id='ブログの確認方法'>
            ブログの確認方法
          </h3>

          <ul>
            <li>(1)ログイン後、ヘッダーにあるブログボタンをクリック。</li>
            <li>(2)表示されるブログ記事のなかから、ご興味のあるものをご覧ください。</li>
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
