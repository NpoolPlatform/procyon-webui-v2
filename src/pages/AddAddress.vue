<template>
  <AddAddress />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AddAddress = defineAsyncComponent(() => import('src/components/wallet/AddAddress.vue'))

</script>
