<template>
  <FAQ />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const FAQ = defineAsyncComponent(() => import('src/components/help/FAQ.vue'))

</script>
