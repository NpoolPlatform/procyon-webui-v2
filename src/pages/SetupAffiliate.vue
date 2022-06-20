<template>
  <SetupAffiliate />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const SetupAffiliate = defineAsyncComponent(() => import('src/components/affiliates/SetupAffiliate.vue'))

</script>
