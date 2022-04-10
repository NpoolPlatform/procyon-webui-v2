<template>
  <UpdatePassword />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const UpdatePassword = defineAsyncComponent(() => import('src/components/user/UpdatePassword.vue'))

</script>
