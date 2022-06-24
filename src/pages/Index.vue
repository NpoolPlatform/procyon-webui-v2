<template>
  <Banner />
  <Products />
  <WhyMe />
  <Feature />
  <WhatIsMining />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/Products.vue'))
const WhyMe = defineAsyncComponent(() => import('src/components/index/WhyMe.vue'))
const Feature = defineAsyncComponent(() => import('src/components/index/Feature.vue'))
const WhatIsMining = defineAsyncComponent(() => import('src/components/index/WhatIsMining.vue'))

</script>

<style lang='sass' scoped>
</style>
