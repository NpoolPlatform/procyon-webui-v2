<template>
  <AddTransferAddress />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AddTransferAddress = defineAsyncComponent(() => import('src/components/wallet/AddTransferAddress.vue'))

</script>
