<template>
  <Wallet />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Wallet = defineAsyncComponent(() => import('src/components/wallet/Wallet.vue'))

</script>
