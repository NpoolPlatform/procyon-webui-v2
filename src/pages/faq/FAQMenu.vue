<template>
  <SupportCenter id='support' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const SupportCenter = defineAsyncComponent(() => import('src/components/help/FAQMenu.vue'))

</script>

<style lang='sass' scoped>
</style>
