<template>
  <BalancePayment />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const BalancePayment = defineAsyncComponent(() => import('src/components/purchase/BalancePayment.vue'))

</script>
