<template>
  <Dashboard />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Dashboard = defineAsyncComponent(() => import('src/components/dashboard/Dashboard.vue'))

</script>
