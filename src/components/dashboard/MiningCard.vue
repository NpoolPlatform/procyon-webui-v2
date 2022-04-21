<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='coin?.Logo'>
      </div>
      <h3 class='mining-title'>
        {{ coin?.Name }}
      </h3>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}:</span>
        <span class='value'>{{ coin?.PreSale ? '*' : _totalEarningCoin.toFixed(2) }} {{ coin?.Unit }}</span>
        <span class='sub-value'>({{ totalEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}:</span>
        <span class='value'>{{ coin?.PreSale ? '*' : _last24HoursEarningCoin.toFixed(2) }} {{ coin.Unit }}</span>
        <span class='sub-value'>({{ last24HoursEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span>
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
          <span class='value'>{{ coin?.PreSale ? '*' : _last30DaysEarningCoin / 30 }} {{ coin.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>{{ coin?.PreSale ? '*' : _last24HoursEarningCoin * 0.2 }} {{ coin.Unit }} (20%)</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>{{ coin?.PreSale ? '*' : _last30DaysEarningCoin / 30 * 0.8 }} {{ coin.Unit }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>{{ goodPeriod }} {{ $t('MSG_DAYS') }}</span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>{{ coin?.PreSale ? '*' : 100000 }} {{ coin.Unit }}</span>
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
  totalEarningCoin,
  useCoinStore,
  useCurrencyStore,
  Currency,
  last30DaysEarningCoin,
  last24HoursEarningCoin,
  useOrderStore,
  PriceCoinName,
  NotificationType
} from 'npool-cli-v2'
import { defineProps, toRef, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import chevrons from '../../assets/chevrons.svg'

interface Props {
  coinTypeId: string
}

const props = defineProps<Props>()
const coinTypeId = toRef(props, 'coinTypeId')
const short = ref(true)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coins = useCoinStore()
const coin = computed(() => coins.getCoinByID(coinTypeId.value))

const order = useOrderStore()
const orders = computed(() => order.Orders.filter((myOrder) => {
  return myOrder?.Good?.Main?.ID === coin.value.ID && order.validateOrder(myOrder)
}))
const goodUnit = computed(() => order.Orders.length > 0 ? order.Orders[0].Good.Good.Good.Unit : '')
const goodPeriod = computed(() => order.Orders.length > 0 ? order.Orders[0].Good.Good.Good.DurationDays : '')
const totalUnits = computed(() => orders.value.reduce((sum, b) => sum + b.Order.Order.Units, 0))

const currency = useCurrencyStore()

const _totalEarningCoin = ref(0)
const totalEarningUSD = ref(0)

const _last24HoursEarningCoin = ref(0)
const last24HoursEarningUSD = ref(0)

const _last30DaysEarningCoin = ref(0)

const getEarning = () => {
  totalEarningCoin(coinTypeId.value, (coinAmount: number) => {
    _totalEarningCoin.value = coinAmount
  })

  last30DaysEarningCoin(coinTypeId.value, (coinAmount: number) => {
    _last30DaysEarningCoin.value = coinAmount
    currency.getCoinCurrency(coin.value, Currency.USD, (currency: number) => {
      totalEarningUSD.value = _totalEarningCoin.value * currency
    })
  })

  last24HoursEarningCoin(coinTypeId.value, (coinAmount: number) => {
    _last24HoursEarningCoin.value = coinAmount
    currency.getCoinCurrency(coin.value, Currency.USD, (currency: number) => {
      last24HoursEarningUSD.value = _last24HoursEarningCoin.value * currency
    })
  })
}

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
    getEarning()
  })
}

onMounted(() => {
  if (coins.Coins.length === 0) {
    getCoins()
    return
  }
  getEarning()
})

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/' })
}

const onExpandClick = () => {
  short.value = !short.value
}

</script>
