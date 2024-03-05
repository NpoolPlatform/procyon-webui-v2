<template>
  <div v-html='content' />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { scrollTo } from 'src/utils/scroll'
import { useRouter } from 'vue-router'
import { article } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = useRouter()

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

const contentUrl = `company/${lang.value}/company_info.html`

const _article = article.useArticleStore()
const getContent = () => {
  _article.getContent({
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
