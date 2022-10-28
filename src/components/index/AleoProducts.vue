<template>
  <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
  <AleoCardLarge
    v-show='firstGood'
    :good='firstGood'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    purchase-caption='MSG_ALEO_PURCHASE_CAPTION'
  />
  <div class='hr' />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppGood, NotifyType, Promotion, Recommend, useAdminAppGoodStore, useAdminPromotionStore, useAdminRecommendStore } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AleoCardLarge = defineAsyncComponent(() => import('src/components/product/AleoCardLarge.vue'))

const good = useAdminAppGoodStore()
const recommend = useAdminRecommendStore()
const promotion = useAdminPromotionStore()

const firstGood = computed(() => good.getGoodByID(recommend.Recommends?.Recommends?.[0].GoodID) as AppGood)

onMounted(() => {
  if (firstGood.value) {
    return
  }
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (promotion.Promotions.Promotions.length === 0) {
    getPromotions(0, 500)
  }
  if (recommend.Recommends.Recommends.length === 0) {
    getRecommends(0, 500)
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

const getRecommends = (offset: number, limit: number) => {
  recommend.getRecommends({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<Recommend>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getRecommends(offset + limit, limit)
  })
}

const getPromotions = (offset: number, limit: number) => {
  promotion.getPromotions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<Promotion>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getPromotions(offset + limit, limit)
  })
}
</script>
