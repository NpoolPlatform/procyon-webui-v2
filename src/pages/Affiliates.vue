<template>
  <Affiliates />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Affiliates = defineAsyncComponent(() => import('src/components/affiliates/Affiliates.vue'))

</script>
