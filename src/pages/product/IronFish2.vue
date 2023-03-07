<template>
  <IronFish2 />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const IronFish2 = defineAsyncComponent(() => import('src/components/ironfish2/IronFish.vue'))

</script>
