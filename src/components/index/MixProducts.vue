<template>
  <div class='content'>
    <div class='columns-2 highlight'>
      <div class='column-2 order-1 with-frame'>
        <h1>First-batch mining</h1>
        <h2>The best mining rewards come to those who start first</h2>
        <ul>
          <li>First-to-market mining products</li>
          <li>Globally proven success record</li>
          <li>Expertly curated product selection</li>
        </ul>
        <button>Learn more</button>
      </div>
      <div class='column-2 order-2'>
        <img src='product/aleo/procyon-product-aleo-homepage.png'>
      </div>
      <div class='column-2 order-4'>
        <img src='product/mixmob/procyon-ido-mixmob-homepage.png'>
      </div>
      <div class='column-2 order-3 with-frame'>
        <h1>Exclusive IDO</h1>
        <h2>VC-level opportunities for everyone</h2>
        <ul>
          <li>Top-tier projects backed by leading VCs</li>
          <li>Highly-vetted by rigorous due diligence</li>
          <li>Early access, limited supply</li>
        </ul>
        <button class='in-active'>Coming soon</button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useGoodStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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

<style lang='sass' scoped>
.order-4,
.order-2
  min-width: 49%

.order-4
  margin-left: -40px
  @media (max-width: $breakpoint-sm-max)
    margin-left: 0
</style>
