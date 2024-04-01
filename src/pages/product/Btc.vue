<template>
  <Btc />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue';

const Btc = defineAsyncComponent(() => import('src/components/btc/Btc.vue'))

</script>
