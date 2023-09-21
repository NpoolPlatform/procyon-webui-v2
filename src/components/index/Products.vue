<template>
  <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
  <!-- <CardLarge
    v-show='firstGood'
    :good='firstGood'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    purchase-caption='MSG_ALEO_PURCHASE_CAPTION'
  /> -->
  <div class='products'>
    <CardSmall v-for='g in goods' :key='g.GoodID' :good='g' />
  </div>
  <div class='hr' />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { notify, appgood } from 'src/npoolstore'

const CardSmall = defineAsyncComponent(() => import('src/components/product/CardSmall.vue'))

const good = appgood.useAppGoodStore()

const goods = computed(() => good.goods(undefined).filter((el) => el?.RecommenderID))

onMounted(() => {
  if (goods.value.length > 0) {
    return
  }
  if (!good.goods(undefined).length) {
    getAppGoods(0, 500)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, g?: Array<appgood.Good>) => {
    if (error || !g?.length) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>
