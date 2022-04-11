<template>
  <KYC />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const KYC = defineAsyncComponent(() => import('src/components/kyc/KYC.vue'))

</script>
