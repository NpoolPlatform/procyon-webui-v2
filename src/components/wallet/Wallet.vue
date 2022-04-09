<template>
  <div class='content'>
    <Balance />
    <div class='hr' />
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Balance = defineAsyncComponent(() => import('src/components/wallet/Balance.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

</script>
