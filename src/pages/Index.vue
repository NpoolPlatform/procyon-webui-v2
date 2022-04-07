<template>
  <div class='content'>
    <Banner />
    <Products />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/Products.vue'))

</script>
