<template>
  <Withdraw />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Withdraw = defineAsyncComponent(() => import('src/components/wallet/Withdraw.vue'))

</script>
