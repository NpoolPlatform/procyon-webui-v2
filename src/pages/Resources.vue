<template>
  <div v-if='locale === "en-US"'>
    <ResourcesEN />
  </div>
  <div else>
    <ResourcesJP />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })
const ResourcesEN = defineAsyncComponent(() => import('src/components/resource/en-US/Resources.vue'))
const ResourcesJP = defineAsyncComponent(() => import('src/components/resource/ja-JP/Resources.vue'))

</script>
