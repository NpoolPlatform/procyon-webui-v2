<template>
  <div class='content'>
    <MiningSummary />
    <div class='hr' />
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
