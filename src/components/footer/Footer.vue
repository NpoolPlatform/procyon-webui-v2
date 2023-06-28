<template>
  <footer>
    <div class='content' :class='[ special ? "special" : "" ]'>
      <div class='columns-4'>
        <div class='column-4'>
          <img class='logo' :src='lightLogo'>
          <h1>
            <span v-html='$t("MSG_SHOOT_FOT_THE_STARS")' />
          </h1>
          <h4 class='tagline'>
            <span v-html='$t("MSG_YOUR_GLOBAL_CONSTELLATION")' />
          </h4>
        </div>
        <div class='column-4'>
          <h4>{{ $t('MSG_LANGUAGE') }}</h4>
          <LangSwitcher />
        </div>
        <div class='column-4'>
          <h4>{{ $t('MSG_LINKS') }}</h4>
          <ul>
            <li><a class='footer-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
            <li><a class='footer-link' target='_blank' @click='router.push({ path: "/", hash: "#products" })'>{{ $t('MSG_PRODUCTS') }}</a></li>
            <li><a class='footer-link' target='_blank' href='https://procyon-vip.medium.com/'>{{ $t('MSG_BLOG') }}</a></li>
          </ul>
        </div>
        <div class='column-4'>
          <h4>{{ $t('MSG_HELP') }}</h4>
          <ul>
            <li><a class='footer-link' target='_blank' @click='router.push({ path: "/", hash: "#support" })'>{{ $t('MSG_FAQ') }}</a></li>
            <li><a class='footer-link' href='contact'>{{ $t('MSG_CONTACT') }}</a></li>
            <li><a class='footer-link' href='legal'>{{ $t('MSG_LEGAL') }}</a></li>
          </ul>
        </div>
      </div>
      <p class='copyright'>
        © 2021-{{ new Date().getFullYear() }} {{ $t('MSG_ORGANIZATION') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang='ts'>
import { useLocaleStore } from 'npool-cli-v4'
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import lightLogo from '../../assets/procyon-light.svg'
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const locale = useLocaleStore()
const special = computed(() => locale.AppLang?.Lang === 'ja-JP')
const router = useRouter()

</script>
