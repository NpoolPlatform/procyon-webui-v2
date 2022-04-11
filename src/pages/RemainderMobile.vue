<template>
  <RemainderMobile />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RemainderMobile = defineAsyncComponent(() => import('src/components/remainder/RemainderMobile.vue'))

</script>
