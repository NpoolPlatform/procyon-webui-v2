<template>
  <div id='home-hero' class='hero'>
    <div class='content'>
      <div class='hero-left'>
        <h1>
          <span v-html='$t("MSG_SLOGAN")' />
        </h1>
        <h2>
          <span v-html='$t("MSG_SUB_SLOGAN")' />
        </h2>
        <button @click='onAvailableNowClick'>
          <span v-html='$t("MSG_AVAILABLE_NOW")' />
        </button>
      </div>
      <img
        class='hero-image' src='product/aleo/aleo-design.png'
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
import { useFrontendAppStore } from 'npool-cli-v4'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const app = useFrontendAppStore()
const jumpPath = computed(() => app.App?.CommitButtonTargets?.[0]?.length > 0 ? app.App?.CommitButtonTargets?.[0] : '/product/aleo')

const router = useRouter()
const onAvailableNowClick = () => {
  console.log('path: ', jumpPath.value)
  void router.push({ path: jumpPath.value })
}

</script>

<style lang='sass' scoped>
</style>
