<template>
  <RemainderAffiliate />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const RemainderAffiliate = defineAsyncComponent(() => import('src/components/remainder/RemainderAffiliate.vue'))

</script>
