<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))

</script>
