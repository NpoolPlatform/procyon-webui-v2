<template>
  <div v-show='goodProfits?.length' class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='target?.Logo'>
      </div>
      <h3 class='mining-title'>
        {{ target?.Name }} ({{ $t('MSG_TESTNET') }})
      </h3>
    </div>
    <div class='warning'>
      <img :src='warning'>
      <span>{{ $t('MSG_TESTNET_WARNING', { COIN_NAME: target?.Name, COIN_UNIT: target?.Unit }) }}</span>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}: </span>
        <span class='value'>{{ utils.getLocaleString(_totalEarningCoin?.toFixed(4)) }} {{ target?.Unit }}</span>
        <span class='sub-value'> (* {{ constant.PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}: </span>
        <span class='value'>{{ utils.getLocaleString(_last24HoursEarningCoin?.toFixed(4)) }} {{ target?.Unit }}</span>
        <span class='sub-value'> (* {{ constant.PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}:</span>
        <span class='value'>{{ utils.getLocaleString(totalUnits) }} {{ $t(goodUnit) }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_OUTPUT') }}:</span>
          <span class='value'>{{ utils.getLocaleString(_last30DaysDailyEarningCoin?.toFixed(4)) }} {{ target?.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>{{ utils.getLocaleString((_last24HoursEarningCoin * 0.2)?.toFixed(4)) }} {{ target?.Unit }} (20%)</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>{{ utils.getLocaleString((_last30DaysDailyEarningCoin * 0.8)?.toFixed(4)) }} {{ target?.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>{{ utils.getLocaleString(goodPeriod) }} {{ $t('MSG_DAYS') }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>{{ utils.getLocaleString(daily?.toFixed(2)) }} {{ target?.Unit }}</span>
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
      <button @click='onPurchaseClick' disabled>
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { spacemesh } from 'src/teststore'
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { appcoin, constant, notify, utils, sdk } from 'src/npoolstore'

import chevrons from '../../assets/chevrons.svg'
import warning from '../../assets/warning.svg'

const coin = appcoin.useAppCoinStore()
const target = computed(() => coin.coins(undefined).find((el) => el.Name?.toLowerCase()?.includes('spacemesh')) as appcoin.AppCoin)

const goodProfits = computed(() => sdk.ledgerProfit.goodProfits(utils.IntervalKey.All, target?.value?.CoinTypeID))

const goodUnit = computed(() => goodProfits.value?.length ? goodProfits.value?.[0].GoodQuantityUnit : '')
const goodPeriod = computed(() => goodProfits.value?.length ? sdk.appPowerRental.appPowerRental(goodProfits?.value?.[0]?.AppGoodID)?.MaxOrderDurationSeconds as number / 60 / 60 / 24 : '')
const totalUnits = computed(() => goodProfits.value?.length ? goodProfits.value?.[0].Units : 0)

const total = computed(() => goodProfits.value?.length ? sdk.appPowerRental.appPowerRental(goodProfits.value?.[0].AppGoodID)?.GoodTotal : 0)
const unitsRatio = computed(() => goodProfits.value?.length && total.value ? Number(totalUnits.value) / Number(total.value) : 0)
const daily = computed(() => _spacemesh.getNetworkDailyOutput)

const short = ref(true)

const _spacemesh = spacemesh.useMockSpacemeshStore()
const _last24HoursEarningCoin = computed(() => {
  return _spacemesh.getLastDaysAvgOutput(unitsRatio.value, _spacemesh.accounts * 1.3)
})
const _last30DaysDailyEarningCoin = computed(() => {
  return _spacemesh.get30DaysAvgOutput(unitsRatio.value, _spacemesh.accounts * 1.3)
})
const _totalEarningCoin = computed(() => {
  return _spacemesh.getEarning(unitsRatio.value, _spacemesh.accounts * 1.3)
})

const ticker = ref(-1)

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/' })
}

const onExpandClick = () => {
  short.value = !short.value
}

onMounted(() => {
  ticker.value = window.setInterval(() => {
    updater()
  }, 30000)
  updater()
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

const updater = () => {
  _spacemesh.getNetworks({
    Message: {
      Error: {
        Title: 'MSG_GET_SPACEMESH_NETWORKS',
        Message: 'MSG_GET_SPACEMESH_NETWORKS_FAIL',
        Popup: false,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    _spacemesh.getEpochs({
      Message: {
        Error: {
          Title: 'MSG_GET_SPACEMESH_NETWORK_INFOS',
          Message: 'MSG_GET_SPACEMESH_NETWORK_INFOS_FAIL',
          Popup: false,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}
</script>
<style lang='sass' scoped>
.mining-summary .warning
  background: #fc4468
  border: 0
  font-size: 20px
  padding: 12px
  margin: 24px 0

.mining-summary .warning span
  font-size: 16px
  line-height: 24px
</style>
