<template>
  <Banner />
  <ProductSummary />
  <MixProducts />
  <WhyMe />
  <div v-if='locale === "en-US"'>
    <WhatWeKnowUS />
    <WhatMakesUS />
  </div>
  <div v-else>
    <WhatMakesJP />
    <WhatWeKnowJP />
  </div>
  <SupportCenter id='support' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })

const Banner = defineAsyncComponent(() => import('src/components/index/Banner.vue'))
const ProductSummary = defineAsyncComponent(() => import('src/components/index/ProductSummary.vue'))
const MixProducts = defineAsyncComponent(() => import('src/components/index/MixProducts.vue'))
const WhyMe = defineAsyncComponent(() => import('src/components/index/WhyMeV2.vue'))
const WhatWeKnowUS = defineAsyncComponent(() => import('src/components/index/en-US/WhatWeKnow.vue'))
const WhatWeKnowJP = defineAsyncComponent(() => import('src/components/index/ja-JP/WhatWeKnow.vue'))
const WhatMakesUS = defineAsyncComponent(() => import('src/components/index/en-US/WhatMakes.vue'))
const WhatMakesJP = defineAsyncComponent(() => import('src/components/index/ja-JP/WhatMakes.vue'))
const SupportCenter = defineAsyncComponent(() => import('src/components/help/FAQMenu.vue'))

</script>

<style lang='sass' scoped>
</style>
