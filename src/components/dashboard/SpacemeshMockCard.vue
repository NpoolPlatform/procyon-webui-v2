<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='coin?.Logo'>
      </div>
      <h3 class='mining-title'>
        {{ coin?.Name }} ({{ $t('MSG_TESTNET') }})
      </h3>
    </div>
    <div class='warning'>
      <img :src='warning'>
      <span>{{ $t('MSG_TESTNET_WARNING', { COIN_NAME: coin.Name, COIN_UNIT: coin.Unit }) }}</span>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}:</span>
        <span class='value'>{{ _totalEarningCoin.toFixed(2) }} {{ coin?.Unit }}</span>
        <span class='sub-value'>(* {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}:</span>
        <span class='value'>{{ _last24HoursEarningCoin.toFixed(2) }} {{ coin.Unit }}</span>
        <span class='sub-value'>(* {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}:</span>
        <span class='value'>{{ totalUnits }} {{ goodUnit }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_OUTPUT') }}:</span>
          <span class='value'>{{ _last30DaysEarningCoin.toFixed(2) }} {{ coin.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>{{ (_last24HoursEarningCoin * 0.2).toFixed(2) }} {{ coin.Unit }} (20%)</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>{{ (_last30DaysEarningCoin * 0.8).toFixed(2) }} {{ coin.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>{{ goodPeriod }} {{ $t('MSG_DAYS') }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>{{ daily.toFixed(2) }} {{ coin.Unit }}</span>
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
      <button @click='onPurchaseClick'>
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  useCoinStore,
  useOrderStore,
  PriceCoinName,
  NotificationType,
  Coin
} from 'npool-cli-v2'
import { useMockSpacemeshStore } from 'src/teststore'
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import chevrons from '../../assets/chevrons.svg'
import warning from '../../assets/warning.svg'

const short = ref(true)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coins = useCoinStore()
const coin = computed(() => {
  let myCoin = undefined as unknown as Coin
  for (const c of coins.Coins) {
    if (c.Name?.toLowerCase().includes('spacemesh')) {
      myCoin = c
      break
    }
  }
  return myCoin
})

const order = useOrderStore()
const orders = computed(() => order.Orders.filter((myOrder) => {
  return myOrder?.Good?.Main?.ID === coin.value.ID && order.validateOrder(myOrder)
}))
const goodUnit = computed(() => order.Orders.length > 0 ? order.Orders[0].Good.Good.Good.Unit : '')
const goodPeriod = computed(() => order.Orders.length > 0 ? order.Orders[0].Good.Good.Good.DurationDays : '')
const totalUnits = computed(() => orders.value.reduce((sum, b) => sum + b.Order.Order.Units, 0))
const unitsRatio = computed(() => {
  return order.Orders.length > 0 ? (totalUnits.value ? totalUnits.value : 1) / order.Orders[0].Good.Good.Good.Total : 0
})
const daily = computed(() => spacemesh.getNetworkDailyOutput)

const spacemesh = useMockSpacemeshStore()

const _last24HoursEarningCoin = computed(() => {
  return spacemesh.getLastDaysAvgOutput(unitsRatio.value, spacemesh.NetworkInfo?.epoch?.stats?.current?.smeshers * 1.3)
})
const _last30DaysEarningCoin = computed(() => {
  return spacemesh.get30DaysAvgOutput(unitsRatio.value, spacemesh.NetworkInfo?.epoch?.stats?.current?.smeshers * 1.3)
})
const _totalEarningCoin = computed(() => _last30DaysEarningCoin.value)

const getCoins = () => {
  coins.getCoins({
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

const ticker = ref(-1)

const updater = () => {
  spacemesh.getNetworks({
    Message: {
      Error: {
        Title: t('MSG_GET_SPACEMESH_NETWORKS'),
        Message: t('MSG_GET_SPACEMESH_NETWORKS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    spacemesh.getNetworkInfo({
      Message: {
        Error: {
          Title: t('MSG_GET_SPACEMESH_NETWORK_INFOS'),
          Message: t('MSG_GET_SPACEMESH_NETWORK_INFOS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

onMounted(() => {
  ticker.value = window.setInterval(() => {
    updater()
  }, 30000)
  updater()

  if (coins.Coins.length === 0) {
    getCoins()
  }
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/' })
}

const onExpandClick = () => {
  short.value = !short.value
}

</script>
