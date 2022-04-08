<template>
  <BackPage>
    <div class='content order-page'>
      <div class='product-container'>
        <div class='product-title-section'>
          <div class='product-page-icon'>
            <img :src='good?.Main?.Logo'>
          </div>
          <h1>{{ good?.Main?.Name }} {{ $t('MSG_MINING') }}</h1>
        </div>
        <slot />
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { Good } from 'npool-cli-v2'
import { defineAsyncComponent, defineProps, toRef } from 'vue'

interface Props {
  good: Good
}

const props = defineProps<Props>()
const good = toRef(props, 'good')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

</script>

<style lang='sass' scoped>
</style>
