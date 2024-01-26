<template>
  <FAQ />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, watch, ref, Component, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { locale } = useI18n({ useScope: 'global' })

const route = useRoute()
interface Query {
  topic: string
}
const query = ref(route.query as unknown as Query)
const topic = ref(query.value.topic)

const FAQ = ref<Component>()
watch(locale, () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  FAQ.value = defineAsyncComponent(() => import(`src/pages/faq/${locale.value}/${topic.value}.vue`))
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  FAQ.value = defineAsyncComponent(() => import(`src/pages/faq/${locale.value}/${topic.value}.vue`))
})

const router = useRouter()
watch(router.currentRoute, () => {
  const path = router.currentRoute.value.path
  if (path?.startsWith('/faq')) {
    const _topic = router.currentRoute.value.query.topic
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
    FAQ.value = defineAsyncComponent(() => import(`src/pages/faq/${locale.value}/${_topic}.vue`))
  }
})

</script>
