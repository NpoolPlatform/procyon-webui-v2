<template>
  <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
  <!-- CardLarge
    v-show='firstGood'
    :good='firstGood'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    purchase-caption='MSG_ALEO_PURCHASE_CAPTION'
  / -->
  <div class='products'>
    <CardSmall v-for='myGood in goods' :key='myGood.Good.Good.ID' :good='myGood' />
  </div>
  <div class='hr' />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useGoodStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

// const CardLarge = defineAsyncComponent(() => import('src/components/product/CardLarge.vue'))
const CardSmall = defineAsyncComponent(() => import('src/components/product/CardSmall.vue'))

const good = useGoodStore()
// const firstGood = computed(() => good.getRecommendGoods?.[0])
const goods = computed(() => good.getRecommendGoods.filter((_, index) => index >= 0 && index < 3))

onMounted(() => {
  if (goods.value.length > 0) {
    return
  }

  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  good.getRecommends({
    Message: {
      Error: {
        Title: t('MSG_GET_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })

  good.getPromotions({
    Message: {
      Error: {
        Title: t('MSG_GET_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })

  good.getAppGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

</script>
