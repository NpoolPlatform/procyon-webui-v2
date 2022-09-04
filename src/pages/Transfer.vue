<template>
  <AddTransfer />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AddTransfer = defineAsyncComponent(() => import('src/components/wallet/Transfer.vue'))

</script>
