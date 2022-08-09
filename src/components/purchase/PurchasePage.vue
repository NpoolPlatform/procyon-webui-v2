<template>
  <BackPage>
    <div class='content order-page'>
      <div class='product-container content-glass'>
        <div class='product-title-section fallback-title'>
          <div class='product-page-icon'>
            <img :src='order?.CoinLogo'>
          </div>
          <h1>{{ order?.CoinName }} {{ $t('MSG_MINING') }}</h1>
        </div>
        <slot />
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { LocalOrder } from 'src/teststore/mock/order'
import { defineAsyncComponent, defineProps, toRef } from 'vue'

interface Props {
  order: LocalOrder
}

const props = defineProps<Props>()
const order = toRef(props, 'order')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

</script>

<style lang='sass' scoped>
.fallback-title
  width: 100%
</style>
