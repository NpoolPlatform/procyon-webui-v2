<template>
  <Withdarw />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Withdarw = defineAsyncComponent(() => import('src/components/wallet/Withdarw.vue'))

</script>
