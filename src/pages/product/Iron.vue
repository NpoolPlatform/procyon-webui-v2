<template>
  <Iron />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Iron = defineAsyncComponent(() => import('src/components/iron/Iron.vue'))

</script>
