<template>
  <AleoSilver />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AleoSilver = defineAsyncComponent(() => import('src/components/aleo-silver2/AleoSilver.vue'))

</script>
