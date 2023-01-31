<template>
  <Resources />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Resources = defineAsyncComponent(() => import('src/components/resource/Resources.vue'))

</script>
