<template>
  <Page>
    <template #body>
      <div v-html='content' />
    </template>
  </Page>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { article } from 'src/npoolstore'

const Page = defineAsyncComponent(() => import('src/pages/faq/Page.vue'))

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

const contentUrl = computed(() => `faq/kyc/${lang.value}/kyc.html`)

const _article = article.useArticleStore()
const getContent = () => {
  _article.getContent({
    ContentURL: contentUrl.value
  }, (error:boolean, str: string) => {
    if (error) return
    content.value = str
  })
}

watch(contentUrl, () => {
  getContent()
})

onMounted(() => {
  getContent()
})
</script>
