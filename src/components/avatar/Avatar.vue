<template>
  <HeaderToolDropdown />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const HeaderToolDropdown = defineAsyncComponent(() => import('src/components/header/HeaderToolDropdown.vue'))
</script>
