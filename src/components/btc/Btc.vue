<template>
  <div class='content'>
    <div class='product-container content-glass project' v-html='content' />
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { article } from 'src/npoolstore'

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

const contentUrl = computed(() => `product/${lang.value}/btc_mining.html`)

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
<style lang='sass' scoped>
</style>
