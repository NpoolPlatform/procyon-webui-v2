<template>
  <GenerateCode />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const GenerateCode = defineAsyncComponent(() => import('src/components/user/GenerateCode.vue'))

</script>
