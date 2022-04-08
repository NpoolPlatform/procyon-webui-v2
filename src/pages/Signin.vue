<template>
  <Signin />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Signin = defineAsyncComponent(() => import('src/components/user/Signin.vue'))

</script>
