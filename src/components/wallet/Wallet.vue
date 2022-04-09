<template>
  <div class='content'>
    <Balance />
    <div class='hr' />
    <Assets />
    <div class='hr' />
    <Transactions />
    <div class='hr' />
    <WithdrawAddresses />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Balance = defineAsyncComponent(() => import('src/components/wallet/Balance.vue'))
const Assets = defineAsyncComponent(() => import('src/components/wallet/Assets.vue'))
const Transactions = defineAsyncComponent(() => import('src/components/wallet/Transactions.vue'))
const WithdrawAddresses = defineAsyncComponent(() => import('src/components/wallet/WithdrawAddresses.vue'))

</script>
