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
        <!-- <span class='value'>{{ coin?.PreSale ? '*' : _totalEarningCoin.toFixed(2) }} {{ coin?.Unit }}</span> -->
        <span class='value'>{{ coin?.PreSale ? '*' : Number(goodGeneral.Incoming).toFixed(2) }} {{ coin?.Unit }}</span>
        <!-- <span class='sub-value'>({{ totalEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span> -->
        <span class='sub-value'>({{ totalUSDTIncoming.toFixed(2) }} {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}:</span>
        <!-- <span class='value'>{{ coin?.PreSale ? '*' : _last24HoursEarningCoin.toFixed(2) }} {{ coin.Unit }}</span> -->
        <span class='value'>{{ coin?.PreSale ? '*' : Number(goodGeneral.Last24Hours).toFixed(2) }} {{ coin.Unit }}</span>
        <!-- <span class='sub-value'>({{ last24HoursEarningUSD.toFixed(2) }} {{ PriceCoinName }})</span> -->
        <span class='sub-value'>({{ last24HoursTotalUSDTIncoming.toFixed(2) }} {{ PriceCoinName }})</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}:</span>
        <!-- <span class='value'>{{ totalUnits }} {{ $t(goodUnit) }}</span> -->
        <span class='value'>{{ goodGeneral.Units }} {{ $t(goodGeneral.GoodUnit) }}</span>
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
      <button @click='onPurchaseClick' :disabled='purchaseDisable'>
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
  NotificationType,
  PaymentState,
  useGoodStore
} from 'npool-cli-v2'
import { GoodGeneral } from 'src/localstore/good'
// import { useLocalOrderStore } from 'src/teststore/mock/order'
import { defineProps, toRef, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import chevrons from '../../assets/chevrons.svg'

interface Props {
  coinTypeId: string
  goodGeneral: GoodGeneral
}

const props = defineProps<Props>()
const coinTypeId = toRef(props, 'coinTypeId')
const goodGeneral = toRef(props, 'goodGeneral')
const short = ref(true)
const totalUSDTIncoming = computed(() => {
  let totalUSDT = 0
  currency.getCoinCurrency(coin.value, Currency.USD, (currency) => {
    totalUSDT = Number(goodGeneral.value.Incoming) * currency
  })
  return totalUSDT
})
const last24HoursTotalUSDTIncoming = computed(() => {
  let totalUSDT = 0
  currency.getCoinCurrency(coin.value, Currency.USD, (currency) => {
    totalUSDT = Number(goodGeneral.value.Last24Hours) * currency
  })
  return totalUSDT
})
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coins = useCoinStore()
const coin = computed(() => coins.getCoinByID(coinTypeId.value))
const productInfo = computed(() => coins.getCoinProductInfoByCoin(coinTypeId.value))

const good = useGoodStore()

const order = useOrderStore()
const orders = computed(() => order.Orders.filter((myOrder) => {
  return myOrder?.Good?.Main?.ID === coin.value.ID &&
      order.validateOrder(myOrder) &&
      myOrder.Order.Payment &&
      myOrder.Order.Payment.State === PaymentState.DONE
}))
// const goodUnit = computed(() => orders.value.length > 0 ? orders.value[0].Good.Good.Good.Unit : '')
const goodPeriod = computed(() => orders.value.length > 0 ? orders.value[0].Good.Good.Good.DurationDays : '')

const productPage = computed(() => productInfo.value.ProductPage)

const purchaseDisable = computed(() => {
  const index = good.Goods.findIndex((el) => {
    for (const g of good.AppGoods) {
      if (g.GoodID === el.Good.Good.ID && el.Main?.ID === coinTypeId.value && g.Visible && g.Online) {
        return true
      }
    }
    return false
  })
  if (index >= 0) {
    return false
  }
  return true
})

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
  if (!productInfo.value) {
    coins.getCoinProductInfos({
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

  if (coins.Coins.length === 0) {
    getCoins()
    return
  }
  getEarning()
})

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: productPage.value })
}

const onExpandClick = () => {
  short.value = !short.value
}

</script>
