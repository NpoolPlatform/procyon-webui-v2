<template>
  <header class='desktop1'>
    <img :src='lightLogo' class='attachment-large size-large logo'>
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='#/blog'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
        <ul class='language-picker'>
          <li class='selected'>
            <a class='language'>EN</a>
          </li>
          <li>
            <a class='language'>JP</a>
          </li>
        </ul>
        <button>
          {{ $t('MSG_REGISTER') }}
        </button>
        <button class='alt'>
          {{ $t('MSG_SIGNIN') }}
        </button>
      </ul>
    </div>
  </header>

  <header class='mobile'>
    <img :src='logo' class='attachment-large size-large logo'>

    <div class='header-inner'>
      <ul class='language-picker'>
        <li class='selected'>
          <a class='language'>EN</a>
        </li>
        <li>
          <a class='language'>JP</a>
        </li>
      </ul>
      <button>
        {{ $t('MSG_REGISTER') }}
      </button>
      <button class='alt'>
        {{ $t('MSG_SIGNIN') }}
      </button>
    </div>
    <div class='hr' />
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='#/blog'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang='ts'>

import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'

</script>

<style lang='sass' scoped>
</style>
