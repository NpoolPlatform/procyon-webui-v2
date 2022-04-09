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
        <span class='value'>{{ coin?.PreSale ? '*' : _totalEarningCoin }} {{ coin?.Unit }}</span>
        <span class='sub-value'>({{ totalEarningUSD }} USDT)</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}:</span>
        <span class='value'>{{ coin?.PreSale ? '*' : _last24HoursEarningCoin }} {{ coin.Unit }}</span>
        <span class='sub-value'>({{ last24HoursEarningUSD }} USDT)</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}:</span>
        <span class='value'>{{ totalUnits }} {{ goodUnit }}</span>
      </div>
    </div>
    <div class='detailed-summary'>
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
    <div class='buttons'>
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
  useOrderStore
} from 'npool-cli-v2'
import { defineProps, toRef, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  coinTypeId: string
}

const props = defineProps<Props>()
const coinTypeId = toRef(props, 'coinTypeId')

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
const last30DaysEarningUSD = ref(0)

onMounted(() => {
  totalEarningCoin(coinTypeId.value, (coinAmount: number) => {
    _totalEarningCoin.value = coinAmount
    currency.getCoinCurrency(coin.value, Currency.USD, (currency: number) => {
      last30DaysEarningUSD.value = _totalEarningCoin.value * currency
    })
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
})

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/' })
}

</script>
