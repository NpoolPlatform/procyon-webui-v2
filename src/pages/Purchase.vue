<template>
  <Purchase />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Purchase = defineAsyncComponent(() => import('src/components/purchase/Purchase.vue'))

</script>
