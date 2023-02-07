<template>
  <Notification />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Notification = defineAsyncComponent(() => import('src/components/notification/Notification.vue'))

</script>
