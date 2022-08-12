<template>
  <Maintenance />
</template>
<script setup lang='ts'>
import { defineAsyncComponent, watch, ref, Component, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })

const Maintenance = ref<Component>()

watch(locale, () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  Maintenance.value = defineAsyncComponent(() => import(`src/pages/maintenance/${locale.value}/Maintenance.vue`))
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  Maintenance.value = defineAsyncComponent(() => import(`src/pages/maintenance/${locale.value}/Maintenance.vue`))
})

</script>
