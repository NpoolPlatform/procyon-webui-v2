<template>
  <div id='home-hero' class='hero'>
    <div class='content'>
      <div class='hero-left'>
        <h1>
          <span v-html='$t("MSG_BTC_SLOGAN")' />
        </h1>
        <h2>
          <span v-html='$t("MSG_BTC_SUB_SLOGAN")' />
        </h2>
        <button @click='onAvailableNowClick' class='active'>
          <span v-html='$t("MSG_BTC_LEARN_MORE")' />
        </button>
      </div>
      <img
        class='hero-image' src='product/btc/bitcoin-banner.png'
      >
    </div>
    <div class='content'>
      <div class='logo-feature'>
        <h3 class='logo-feature-title'>
          <span v-html='$t("MSG_ALEO_BACKER")' />
        </h3>
        <img src='vc-logos/softbank.png'>
        <img src='vc-logos/a16z.png'>
        <img src='vc-logos/coinbase.png'>
        <img src='vc-logos/kora.png'>
        <img src='vc-logos/slow-ventures.png'>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { localapp } from 'src/npoolstore'

const app = localapp.useLocalApplicationStore()
const jumpPath = computed(() => app.commitBtnTargets()[0] || '/product/btc')

const router = useRouter()
const onAvailableNowClick = () => {
  void router.push({ path: jumpPath.value })
}

</script>

<style lang='sass' scoped>
</style>
