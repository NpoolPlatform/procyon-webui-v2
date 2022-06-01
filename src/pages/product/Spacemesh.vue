<template>
  <Spacemesh />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Spacemesh = defineAsyncComponent(() => import('src/components/product/Spacemesh.vue'))

</script>
