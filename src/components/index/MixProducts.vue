<template>
  <div class='content'>
    <div class='columns-2 highlight'>
      <div class='column-2 order-1 with-frame'>
        <h1> <span v-html='$t("MSG_FIRST_BATCH_MINING_TITLE")' /> </h1>
        <h2>{{ $t('MSG_FIRST_BATCH_MINING_SUBTITLE') }}</h2>
        <p v-html='$t("MSG_FIRST_BATCH_MINING_CONTENT")' />
        <button @click='onAleoClick'>
          {{ $t('MSG_LEARN_MORE') }}
        </button>
      </div>
      <div class='column-2 order-2'>
        <img src='product/aleo/procyon-product-aleo-homepage.png'>
      </div>
      <div class='column-2 order-4'>
        <img src='product/mixmob/procyon-ido-mixmob-homepage.png'>
      </div>
      <div class='column-2 order-3 with-frame'>
        <h1>{{ $t('MSG_EXCLUSIVE_IDO_TITLE') }}</h1>
        <h2>{{ $t('MSG_EXCLUSIVE_IDO_SUBTITLE') }}</h2>
        <p v-html='$t("MSG_EXCLUSIVE_IDO_CONTENT")' />
        <button class='in-active' disabled>
          {{ $t('MSG_COMING_SOON') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useGoodStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

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

const router = useRouter()

const onAleoClick = () => {
  void router.push({ path: '/product/aleo' })
}

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
