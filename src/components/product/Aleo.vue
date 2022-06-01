<template>
  <ProductPage :good-id='goodId' project-class='project-aleo' bg-img='product/aleo/aleo-banner.jpg' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

interface Query {
  goodId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodId = computed(() => query.value.goodId)

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

</script>

<style lang='sass' scoped>
</style>
