<template>
  <Aleo />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Aleo = defineAsyncComponent(() => import('src/components/product/Aleo.vue'))

</script>
