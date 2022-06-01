<template>
  <BackPage>
    <div class='content order-page'>
      <div :class='[ "product-container content-glass project", projectClass ]'>
        <div class='product-title-section project-title-section' :style='{"background-image": "url(" + bgImg + ")"}'>
          <div class='product-title-container'>
            <div class='product-page-icon'>
              <img :src='good?.Main?.Logo'>
            </div>
            <h1>{{ good?.Main?.Name }} {{ $t('MSG_MINING') }}</h1>
          </div>
        </div>
        <div class='info'>
          <h3 class='form-title'>
            {{ $t('MSG_PRODUCT_DETAILS') }}
          </h3>
          <div class='info-flex'>
            <div class='three-section'>
              <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
              <span class='number'>*</span>
              <span class='unit'>{{ good?.Main?.Unit }} / {{ $t('MSG_DAY') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
              <span class='number'>{{ good?.Good?.Good?.DurationDays }}</span>
              <span class='unit'>{{ $t('MSG_DAYS') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
              <span class='number'>20</span>
              <span class='unit'>%</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_MAINTENANCE_FEE') }}:</h4>
              <span class='number'>1.5</span>
              <span class='unit'>{{ PriceCoinName }} / {{ $t('MSG_DAY') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
              <span class='number'>{{ formatTime(good?.Good?.Good?.StartAt, true) }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_PRICE') }}:</h4>
              <span class='number'>{{ good?.Good?.Good?.Price }}</span>
              <span class='unit'>{{ PriceCoinName }}</span>
            </div>
            <div class='product-detail-text'>
              <slot />
            </div>
          </div>
        </div>
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { formatTime, PriceCoinName, CoinDescriptionUsedFor, useCoinStore, useGoodStore, NotificationType } from 'npool-cli-v2'
import { defineAsyncComponent, defineProps, toRef, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  goodId: string
  projectClass: string
  bgImg: string
}

const props = defineProps<Props>()
const goodId = toRef(props, 'goodId')
const projectClass = toRef(props, 'projectClass')
const bgImg = toRef(props, 'bgImg')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const coin = useCoinStore()
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale && coin.ENV === good.value?.Main?.ENV))

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))
const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))

onMounted(() => {
  if (!good.value) {
    goods.getGood({
      ID: goodId.value,
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD'),
          Message: t('MSG_GET_GOOD_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (coins.value.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS'),
          Message: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (!description.value) {
    coin.getCoinDescriptions({
      Message: {
        Error: {
          Title: t('MSG_GET_COIN_DESCRIPTIONS'),
          Message: t('MSG_GET_COIN_DESCRIPTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

</script>

<style lang='sass' scoped>
</style>
