<template>
  <div v-html='content' />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { article } from 'src/npoolstore'

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

const contentUrl = computed(() => `company/${lang.value}/company_info.html`)

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
