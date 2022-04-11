<template>
  <RemainderKYC />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RemainderKYC = defineAsyncComponent(() => import('src/components/remainder/RemainderKYC.vue'))

</script>
