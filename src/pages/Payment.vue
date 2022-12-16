<template>
  <OrderDetail />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OrderDetail = defineAsyncComponent(() => import('src/components/purchase/OrderDetail.vue'))

</script>
