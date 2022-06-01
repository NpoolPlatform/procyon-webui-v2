<template>
  <div class='product'>
    <div class='product-heading'>
      <img class='icon' :src='coin.getCoinLogo(good.Main as Coin)'>
      <h3 class='product-title'>
        {{ good.Good.Good.Title }}
      </h3>
    </div>
    <h4 class='price'>
      <span>{{ goods.getGoodPrice(good) }}</span> {{ PriceCoinName }} / {{ good.Good.Good.Unit }}
    </h4>
    <div class='line'>
      <span class='label'>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</span>
      <span class='value'>*{{ good.Main?.Unit }} / {{ $t('MSG_DAY') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
      <span class='value'>{{ good.Good.Good.DurationDays }} {{ $t('MSG_DAYS') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
      <span class='value'>20%</span>
    </div>

    <!-- div class='line'>
      <span class='label'>{{ $t('MSG_MAINTENANCE_FEE') }}:</span>
      <span class='value'>* / {{ $t('MSG_DAY') }}</span>
    </div -->

    <div class='line'>
      <span class='label'>{{ $t('MSG_ORDER_EFFECTIVE') }}:</span>
      <span class='value'>{{ formatTime(good.Good.Good.StartAt, true) }}</span>
    </div>
    <button class='alt' @click='onPurchaseClick' :disabled='!buyer'>
      {{ $t('MSG_PURCHASE') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, computed, onMounted } from 'vue'
import { Good, useGoodStore, formatTime, useCoinStore, Coin, PriceCoinName, useUserStore, NotificationType } from 'npool-cli-v2'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  good: Good
}

const props = defineProps<Props>()
const good = toRef(props, 'good')

const goods = useGoodStore()
const coin = useCoinStore()
const productInfo = computed(() => coin.getCoinProductInfoByCoin(good.value?.Main?.ID as string))

const user = useUserStore()
const buyer = computed(() => user.buyer)

const router = useRouter()
const onPurchaseClick = () => {
  let target = '/purchase'
  if (productInfo.value?.ProductPage?.length) {
    target = productInfo.value.ProductPage
  }

  void router.push({
    path: target,
    query: {
      goodId: good.value.Good.Good.ID
    }
  })
}

onMounted(() => {
  if (!productInfo.value) {
    coin.getCoinProductInfos({
      Message: {
        Error: {
          Title: t('MSG_GET_COIN_PRODUCT_INFOS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>
