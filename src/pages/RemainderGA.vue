<template>
  <RemainderGA />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RemainderGA = defineAsyncComponent(() => import('src/components/remainder/RemainderGA.vue'))

</script>
