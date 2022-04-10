<template>
  <footer>
    <div class='content'>
      <div class='columns-4'>
        <div class='column-4'>
          <img class='logo' :src='lightLogo'>
          <h1>Shoot for the Stars</h1>
          <h4 class='tagline'>
            Your global constellation of cryptocurrencies
          </h4>
        </div>
        <div class='column-4'>
          <h4>Language</h4>
          <LangSwitcher />
        </div>
        <div class='column-4'>
          <h4>Links</h4>
          <ul>
            <li><a class='footer-link'>Home</a></li>
            <li><a class='footer-link'>Products</a></li>
            <li><a class='footer-link'>Blog</a></li>
          </ul>
        </div>
        <div class='column-4'>
          <h4>Help</h4>
          <ul>
            <li><a class='footer-link'>FAQ</a></li>
            <li><a class='footer-link' href='mailto:support@procyon.vip'>Contact</a></li>
            <li><a class='footer-link'>LEGAL</a></li>
          </ul>
        </div>
      </div>
      <p class='copyright'>
        © 2021 PRCN Technology Ltd.
      </p>
    </div>
  </footer>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

import lightLogo from '../../assets/procyon-light.svg'
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

</script>
