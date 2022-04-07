<template>
  <Registration />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Registration = defineAsyncComponent(() => import('src/components/user/Registration.vue'))

</script>
