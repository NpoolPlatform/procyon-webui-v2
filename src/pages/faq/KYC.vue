<template>
  <Page>
    <template #body>
      <h2>Procyon Platform - KYC</h2>
      <!-- <div id='kyc' /> -->
      <div v-html='content' />
    </template>
  </Page>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { scrollTo } from 'src/utils/scroll'
import { useRouter } from 'vue-router'
import { useArticleStore } from 'src/npoolstore/cms/article'

const Page = defineAsyncComponent(() => import('src/pages/faq/Page.vue'))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = useRouter()

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

const contentUrl = `faq/kyc/${lang.value}/kyc-${lang.value.toLowerCase()?.split('-').join('_')}.html`

const article = useArticleStore()
const getContent = () => {
  article.getContent({
    ContentURL: contentUrl
  }, (error:boolean, str: string) => {
    if (error) return
    content.value = str
  })
}

onMounted(() => {
  getContent()
})
</script>
