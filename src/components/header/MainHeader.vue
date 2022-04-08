<template>
  <header class='desktop1'>
    <img :src='lightLogo' class='attachment-large size-large logo'>
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='#/blog'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
        <LangSwitcher />
        <SignHelper v-if='!logined.getLogined' />
        <AvatarDropdown v-else>
          HHHHHHHHHHHHHHH
        </AvatarDropdown>
      </ul>
    </div>
  </header>

  <header class='mobile'>
    <img :src='logo' class='attachment-large size-large logo'>

    <div class='header-inner'>
      <LangSwitcher />
      <SignHelper v-if='!logined.getLogined' />
      <AvatarDropdown v-else>
        HHHHHHHHHHHHH
      </AvatarDropdown>
    </div>
    <div class='hr' />
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { useLoginedUserStore } from 'npool-cli-v2'
import { defineAsyncComponent } from 'vue'
import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))

const logined = useLoginedUserStore()

</script>

<style lang='sass' scoped>
</style>
