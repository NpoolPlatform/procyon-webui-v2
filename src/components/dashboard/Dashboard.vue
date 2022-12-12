<template>
  <div class='content'>
    <MiningSummary />
    <div class='hr' />
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
  />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IntervalKey } from 'src/const/const'
import { QAjaxBar } from 'quasar'
import {
  AppGood,
  GoodProfit,
  NotifyType,
  Order,
  Profit,
  SecondsEachDay,
  useAdminAppCoinStore,
  useAdminAppGoodStore,
  useAdminCurrencyStore,
  useFrontendOrderStore,
  useFrontendProfitStore
} from 'npool-cli-v4'
import { getCoins, getCurrencies } from 'src/api/chain'

const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const profit = useFrontendProfitStore()
const coin = useAdminAppCoinStore()
const order = useFrontendOrderStore()
const good = useAdminAppGoodStore()
const currency = useAdminCurrencyStore()

onMounted(() => {
  if (profit.Profits.Profits.length === 0) {
    getProfits(0, 100)
  }
  if (profit.getIntervalProfitsByKey(IntervalKey.LastDay).length === 0) {
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }

  if (profit.GoodProfits.GoodProfits.length === 0) {
    getGoodProfits(0, 100)
  }
  if (profit.getIntervalGoodProfitsByKey(IntervalKey.LastDay).length === 0) {
    getIntervalGoodProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (profit.getIntervalGoodProfitsByKey(IntervalKey.LastMonth).length === 0) {
    getIntervalGoodProfits(
      IntervalKey.LastMonth,
      Math.ceil(new Date().getTime() / 1000) - (SecondsEachDay * 30),
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }

  if (order.Orders.Orders.length === 0) {
    getOrders(0, 100)
  }

  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }

  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
  if (currency.Currencies.Currencies.length === 0 || currency.expired()) {
    currency.$reset()
    getCurrencies(0, 100)
  }
})

const getProfits = (offset:number, limit: number) => {
  profit.getProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Profit>) => {
    if (error || rows.length < limit) {
      return
    }
    getProfits(limit + offset, limit)
  })
}

const getIntervalProfits = (key: IntervalKey, startAt: number, endAt: number, offset: number, limit: number) => {
  profit.getIntervalProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<Profit>) => {
    if (error || rows.length < limit) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getGoodProfits = (offset: number, limit: number) => {
  profit.getGoodProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<GoodProfit>) => {
    if (error || rows.length < limit) {
      return
    }
    getGoodProfits(limit + offset, limit)
  })
}

const getIntervalGoodProfits = (key: IntervalKey, startAt: number, endAt: number, offset: number, limit: number) => {
  profit.getIntervalGoodProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<GoodProfit>) => {
    if (error || rows.length < limit) {
      return
    }
    getIntervalGoodProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getOrders = (offset:number, limit: number) => {
  order.getOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<Order>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getOrders(offset + limit, limit)
  })
}

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<AppGood>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
