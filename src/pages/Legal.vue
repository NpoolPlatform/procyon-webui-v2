<template>
  <Legal />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, watch, ref, Component, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })
const Legal = ref<Component>()

watch(locale, () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  Legal.value = defineAsyncComponent(() => import(`src/pages/legal/${locale.value}/Legal.vue`))
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  Legal.value = defineAsyncComponent(() => import(`src/pages/legal/${locale.value}/Legal.vue`))
})

</script>

<style lang='sass' scoped>
.mm
  margin-top: -96px
</style>
