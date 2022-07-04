<template>
  <div class='content faq'>
    <div id='hero'>
      <h1>
        <span v-html='$t("MSG_SUPPORT_CENTER")' />
      </h1>
      <div v-show='false' id='search-box'>
        <form>
          <input id='search-field' type='text'>
          <input id='search-button' type='submit' value='Search'>
        </form>
      </div>
    </div>

    <h2>
      <span v-html='$t("MSG_PROCYON_PLATFORM")' />
    </h2>
    <div class='faq-menu-cointainer'>
      <a v-for='faq in faqs' :key='faq.topic' class='faq-menu-item' @click='onItemClick(faq)'>
        <img :src='faq.icon'>
        <div class='faq-menu-item-info'>
          <h2>{{ $t(faq.title) }}</h2>
          <span>{{ $t(faq.subtitle) }}</span>
        </div>
      </a>
    </div>

    <h2>{{ $t('MSG_PROCYON_PRODUCTS') }}</h2>
    <div class='faq-menu-cointainer'>
      <a class='faq-menu-item' @click='onAleoClick'>
        <img class='faq-product' src='product/aleo/product-aleo.png'>
        <div class='faq-menu-item-info'>
          <h2>{{ $t('MSG_ALEO_FAQ_MENU_TITLE') }}</h2>
          <span>{{ $t('MSG_ALEO_FAQ_MENU_SUBTITLE') }}</span>
        </div>
      </a>
      <a class='faq-menu-item' @click='onSpacemeshClick'>
        <img class='faq-product' src='product/spacemesh/product-spacemesh.svg'>
        <div class='faq-menu-item-info'>
          <h2>{{ $t('MSG_SPACEMESH_FAQ_MENU_TITLE') }}</h2>
          <span>{{ $t('MSG_SPACEMESH_FAQ_MENU_SUBTITLE') }}</span>
        </div>
      </a>
    </div>
    <!--
    <h2>Learning Center</h2>
    <div class='faq-menu-cointainer'>
      <a class='faq-menu-item'>
        <img src='font-awesome/tools.svg'>
        <div class='faq-menu-item-info'>
          <h2>Mining</h2>
          <span>Learn all about crypto mining</span>
        </div>
      </a>
    </div>-->
    <div class='hr' />

    <h2>{{ $t('MSG_CANT_FIND_LOOKING_FOR') }}</h2>
    <button @click='onContactClick'>
      {{ $t('MSG_CONTANT_SUPPORT') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface FaqItem {
  icon: string
  topic: string
  title: string
  subtitle: string
}

const faqs = computed(() => [
  {
    icon: 'font-awesome/lock.svg',
    topic: 'Login',
    title: 'MSG_LOGIN_FAQ_MENU_TITLE',
    subtitle: 'MSG_LOGIN_FAQ_MENU_SUBTITLE'
  }, {
    icon: 'font-awesome/user.svg',
    topic: 'AccountSettings',
    title: 'MSG_ACCOUNT_SETTINGS_FAQ_MENU_TITLE',
    subtitle: 'MSG_ACCOUNT_SETTINGS_FAQ_MENU_SUBTITLE'
  }, {
    icon: 'font-awesome/chart-line.svg',
    topic: 'Dashboard',
    title: 'MSG_DASHBOARD_FAQ_MENU_TITLE',
    subtitle: 'MSG_DASHBOARD_FAQ_MENU_SUBTITLE'
  }, /* {
    icon: 'font-awesome/bitcoin.svg',
    topic: 'Payments',
    title: 'MSG_PAYMENTS_FAQ_MENU_TITLE',
    subtitle: 'MSG_PAYMENTS_FAQ_MENU_SUBTITLE'
  }, */ {
    icon: 'font-awesome/user-check.svg',
    topic: 'KYC',
    title: 'MSG_KYC_FAQ_MENU_TITLE',
    subtitle: 'MSG_KYC_FAQ_MENU_SUBTITLE'
  }, {
    icon: 'font-awesome/shield-half.svg',
    topic: 'Security',
    title: 'MSG_SECURITY_FAQ_MENU_TITLE',
    subtitle: 'MSG_SECURITY_FAQ_MENU_SUBTITLE'
  }, {
    icon: 'font-awesome/question.svg',
    topic: 'General',
    title: 'MSG_GENERAL_FAQ_MENU_TITLE',
    subtitle: 'MSG_GENERAL_FAQ_MENU_SUBTITLE'
  }
] as Array<FaqItem>)

const router = useRouter()

const onItemClick = (faq: FaqItem) => {
  void router.push({
    path: '/faq',
    query: {
      topic: faq.topic
    }
  })
}

const onSpacemeshClick = () => {
  void router.push({
    path: '/faq',
    query: {
      topic: 'Spacemesh'
    }
  })
}

const onAleoClick = () => {
  void router.push({
    path: '/faq',
    query: {
      topic: 'Aleo'
    }
  })
}

const onContactClick = () => {
  void router.push({ path: '/contact' })
}

</script>
