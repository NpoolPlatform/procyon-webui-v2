<template>
  <ResetPassword />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const ResetPassword = defineAsyncComponent(() => import('src/components/user/ResetPassword.vue'))

</script>
