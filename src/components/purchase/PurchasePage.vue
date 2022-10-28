<template>
  <BackPage>
    <div class='content order-page'>
      <div class='product-container content-glass'>
        <div class='product-title-section fallback-title'>
          <div class='product-page-icon'>
            <img :src='good?.CoinLogo'>
          </div>
          <h1>{{ good?.CoinName }} {{ $t('MSG_MINING') }}</h1>
        </div>
        <slot />
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { AppGood } from 'npool-cli-v4'
import { defineAsyncComponent, defineProps, toRef } from 'vue'

interface Props {
  good: AppGood;
}

const props = defineProps<Props>()
const good = toRef(props, 'good')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

</script>

<style lang='sass' scoped>
.fallback-title
  width: 100%
</style>
