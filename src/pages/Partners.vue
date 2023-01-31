<template>
  <div v-if='locale === "en-US"'>
    <PartnersUS />
  </div>
  <div v-else>
    <PartnersJP />
  </div>
</template>
<script lang='ts' setup>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })
const PartnersUS = defineAsyncComponent(() => import('src/components/index/en-US/Partners.vue'))
const PartnersJP = defineAsyncComponent(() => import('src/components/index/ja-JP/Partners.vue'))
</script>
