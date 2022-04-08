<template>
  <Payment />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Payment = defineAsyncComponent(() => import('src/components/purchase/Payment.vue'))

</script>
