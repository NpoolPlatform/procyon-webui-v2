<template>
  <ProductPage :good='good' project-class='project-aleo' bg-img='product/aleo/aleo-banner.jpg' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGoodStore } from 'npool-cli-v2'

interface Query {
  goodId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodId = computed(() => query.value.goodId)

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

</script>

<style lang='sass' scoped>
</style>
