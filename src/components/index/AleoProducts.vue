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
import { useGoodStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AleoCardLarge = defineAsyncComponent(() => import('src/components/product/AleoCardLarge.vue'))

const good = useGoodStore()
const firstGood = computed(() => good.getRecommendGoods?.[0])

onMounted(() => {
  if (firstGood.value) {
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
