<template>
  <IronFish />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const IronFish = defineAsyncComponent(() => import('src/components/ironfish/IronFish.vue'))

</script>
