<template>
  <Legal />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Legal = defineAsyncComponent(() => import('src/components/help/Legal.vue'))

</script>
