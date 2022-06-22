<template>
  <Banner />
  <Products />
  <WhyMe />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/MixProducts.vue'))
const WhyMe = defineAsyncComponent(() => import('src/components/index/WhyMeV2.vue'))

</script>

<style lang='sass' scoped>
</style>
