<template>
  <div class='content'>
    <Banner />
    <Products />
    <Whyprocyon />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const Products = defineAsyncComponent(() => import('src/components/index/Products.vue'))
const Whyprocyon = defineAsyncComponent(() => import('src/components/index/Whyprocyon.vue'))

</script>
