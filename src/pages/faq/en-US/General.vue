<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - General Info</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>Navigation</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Does Procyon have a mobile app?")'>Does Procyon have a mobile app?</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Does Procyon have a mobile app?'>
            Does Procyon have a mobile app?
          </h3>

          <p>
            We plan to launch an official mobile app for our platform in the future, but will first launch on our
            browser-based website.
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
