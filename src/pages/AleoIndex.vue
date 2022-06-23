<template>
  <Banner />
  <Products />
  <WhyMe />
  <SupportCenter id='support' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/MixProducts.vue'))
const WhyMe = defineAsyncComponent(() => import('src/components/index/WhyMeV2.vue'))
const SupportCenter = defineAsyncComponent(() => import('src/components/help/FAQMenu.vue'))

</script>

<style lang='sass' scoped>
</style>
