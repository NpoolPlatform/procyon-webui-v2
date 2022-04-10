<template>
  <EnableGoogle />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const EnableGoogle = defineAsyncComponent(() => import('src/components/user/EnableGoogle.vue'))

</script>
