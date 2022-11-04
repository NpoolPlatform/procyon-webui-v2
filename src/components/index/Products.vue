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
import { useI18n } from 'vue-i18n'
import { NotifyType, useAdminAppGoodStore, AppGood } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CardSmall = defineAsyncComponent(() => import('src/components/product/CardSmall.vue'))

const good = useAdminAppGoodStore()

const goods = computed(() => good.AppGoods.AppGoods.filter((el) => el.RecommenderID !== ''))

onMounted(() => {
  if (goods.value.length > 0) {
    return
  }
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<AppGood>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>
