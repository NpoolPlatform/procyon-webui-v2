<template>
  <Security />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Security = defineAsyncComponent(() => import('src/components/security/Security.vue'))

</script>
