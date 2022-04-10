<template>
  <div class='content'>
    <Settings />
    <div class='hr' />
    <LoginHistory />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Settings = defineAsyncComponent(() => import('src/components/security/Settings.vue'))
const LoginHistory = defineAsyncComponent(() => import('src/components/security/LoginHistory.vue'))

</script>

<style lang='sass' scoped>
.disabled
  cursor: not-allowed

.enabled
  cursor: pointer
</style>
