<template>
  <VerifyGoogle />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const VerifyGoogle = defineAsyncComponent(() => import('src/components/user/VerifyGoogle.vue'))

</script>
