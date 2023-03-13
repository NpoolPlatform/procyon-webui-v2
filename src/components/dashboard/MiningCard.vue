<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='goodProfit?.CoinLogo'>
      </div>
      <h3 class='mining-title'>
        <div v-html='target?.DisplayNames?.[2]? $t(target?.DisplayNames?.[2]) : goodProfit.GoodName' />
      </h3>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : goodProfit?.TotalInComing }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : goodProfit?.Last24HoursInComing }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}: </span>
        <span class='value'>{{ goodProfit?.Units }}</span>
        <span class='sub-value'>{{ goodProfit ? $t(goodProfit?.GoodUnit) : '' }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_OUTPUT') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : goodProfit.Last30DaysInComing / 30 }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>
            {{ goodProfit?.GoodServicePeriodDays }}
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : goodProfit.Last24HoursInComing * 0.2 }}
            <span class='unit'>{{ goodProfit?.CoinUnit }} (20%)</span>
          </span>
        </div>
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : goodProfit.Last30DaysInComing / 30 * 0.8 }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>
            {{ '*' }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <div class='line' v-if='goodProfit.GoodID === "de420061-e878-4a8b-986a-805cadd59233"'>
          <span class='label'>{{ $t('MSG_PROVER_INCENTIVE') }}:</span>
          <span class='value'>
            {{ goodProfit.TotalEstimatedDailyReward === 0 ? '*' : goodProfit.TotalEstimatedDailyReward }}
            <span class='unit'>{{ $t('MSG_CREDITS') }}</span></span>
        </div>
        <div class='warning' v-if='target?.Descriptions?.[3] && target?.Descriptions?.[3]?.length > 0'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t(target?.Descriptions?.[3])' />
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
      <button
        :class='["alt", getStatus(target as AppGood) ? "in-active" : ""]'
        :disabled='getStatus(target as AppGood)'
        @click='onPurchaseClick'
      >
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { AppGood, useAdminAppCoinStore, useAdminAppGoodStore } from 'npool-cli-v4'
import { MyGoodProfit } from 'src/localstore/ledger/types'
import { defineProps, toRef, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import chevrons from '../../assets/chevrons.svg'

interface Props {
  profit: MyGoodProfit;
}

const props = defineProps<Props>()
const goodProfit = toRef(props, 'profit')

const short = ref(true)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodProfit.value?.GoodID))

const getStatus = computed(() => (_good: AppGood) => !_good.EnableProductPage || !good.haveSale(_good) || !good.haveStock(_good))

const coin = useAdminAppCoinStore()
const productInfo = computed(() => coin.getCoinByID(goodProfit.value?.CoinTypeID))
const productPage = computed(() => productInfo.value?.ProductPage)

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
<style lang='sass' scoped>
  .top-line-item .value
    padding-right: 5px
</style>
