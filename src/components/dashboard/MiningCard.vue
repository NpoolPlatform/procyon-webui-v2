<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='general?.CoinLogo'>
      </div>
      <h3 class='mining-title'>
        {{ general?.CoinName }}
      </h3>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}:</span>
        <span class='value'>{{ general?.CoinPresale ? '*' : Number(general?.Incoming).toFixed(2) }} {{ general?.CoinUnit }}</span>
        <span class='sub-value'>({{ totalEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}:</span>
        <span class='value'>{{ general?.CoinPresale ? '*' : Number(general?.Last24HoursIncoming).toFixed(2) }} {{ general?.CoinUnit }}</span>
        <span class='sub-value'>({{ last24HoursEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}:</span>
        <span class='value'>{{ general?.Units }} {{ general ? $t(general?.GoodUnit) : '' }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_OUTPUT') }}:</span>
          <span class='value'>{{ general?.CoinPresale ? '*' : _last30DaysEarningCoin / 30 }} {{ general?.CoinUnit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>{{ general?.CoinPresale ? '*' : _last24HoursEarningCoin * 0.2 }} {{ general?.CoinUnit }} (20%)</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>{{ general?.CoinPresale ? '*' : _last30DaysEarningCoin / 30 * 0.8 }} {{ general?.CoinUnit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>{{ general?.GoodServicePeriodDays }} {{ $t('MSG_DAYS') }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>{{ general?.CoinPresale ? '*' : 1000 }} {{ general?.CoinUnit }}</span>
        </div>
      </div>
    </q-slide-transition>
    <div class='buttons'>
      <button :class='[ "alt show-more", short ? "" : "open" ]' @click='onExpandClick'>
        <img :src='chevrons'>
      </button>
      <button class='alt' disabled>
        {{ $t('MSG_EXPORT_DAILY_OUTPUT_CSV') }}
      </button>
      <button @click='onPurchaseClick' :disabled='good.canBuy(general.GoodID, general.CoinTypeID)'>
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  PriceCoinName
} from 'npool-cli-v2'
import { useAdminAppCoinStore, useAdminAppGoodStore } from 'npool-cli-v4'
import { GoodGeneral } from 'src/localstore/good'
import { defineProps, toRef, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import chevrons from '../../assets/chevrons.svg'

interface Props {
  general: GoodGeneral;
}

const props = defineProps<Props>()
const general = toRef(props, 'general')
const short = ref(true)

const coin = useAdminAppCoinStore()
const productInfo = computed(() => coin.getCoinByID(general.value?.CoinTypeID))
const productPage = computed(() => productInfo.value?.ProductPage)

const good = useAdminAppGoodStore()

const totalEarningUSD = ref(0)
const _last24HoursEarningCoin = ref(0)
const last24HoursEarningUSD = ref(0)
const _last30DaysEarningCoin = ref(0)

const router = useRouter()
const onPurchaseClick = () => {
  let target = '/#'
  if (productPage.value) {
    target = productPage.value
  }
  void router.push({ path: target })
}

const onExpandClick = () => {
  short.value = !short.value
}

</script>
