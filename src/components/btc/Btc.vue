<template>
  <div class='content'>
    <div class='product-container content-glass project' v-html='content' />
  </div>
  <!-- <ProductPage
    :app-good-i-d='(undefined as unknown as string)'
    :purchase-amount='0'
    project-class='project-aleo'
    bg-img='product/btc/btc-banner.jpg'
    :customize-info='true'
  >
    <div v-html='content' />
  </ProductPage> -->
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { article } from 'src/npoolstore'

const { locale } = useI18n({ useScope: 'global' })
const lang = computed(() => locale.value as string)
const content = ref('')

// const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

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
