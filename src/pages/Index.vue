<template>
  <div class='content'>
    <Banner />
    <Products />
    <WhyMe />
  </div>
  <div class='content2'>
    <Feature />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/Products.vue'))
const WhyMe = defineAsyncComponent(() => import('src/components/index/WhyMe.vue'))
const Feature = defineAsyncComponent(() => import('src/components/index/Feature.vue'))

</script>

<style lang='sass' scoped>
.content2
  margin: 0 auto
  padding: 0 24px
  @media (max-width: $breakpoint-sm-max)
  padding: 0 12px
</style>
