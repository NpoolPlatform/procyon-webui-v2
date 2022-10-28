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
import { Profit, useProfitStore } from 'src/teststore/mock/profit'
import { defineAsyncComponent, onMounted } from 'vue'
import { NotificationType, SecondsEachDay, useCoinStore, useStockStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { IntervalKey } from 'src/const/const'
import { QAjaxBar } from 'quasar'
import { useLocalLedgerStore } from 'src/localstore/ledger'
import { NotifyType, Order, useFrontendOrderStore } from 'npool-cli-v4'

const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const profit = useProfitStore()
const order = useFrontendOrderStore()
const coin = useCoinStore()
const stock = useStockStore()
const localledger = useLocalLedgerStore()

const getIntervalProfits = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  profit.getIntervalProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, key, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count === 0) {
      switch (key) {
        case IntervalKey.LastDay:
          if (profit.CoinProfits.get(key)) {
            localledger.initLastDayProfit(profit.CoinProfits.get(key)?.Profits as Array<Profit>)
          }
          break
        case IntervalKey.LastMonth:
          if (profit.CoinProfits.get(key)) {
            localledger.initLastMonthProfit(profit.CoinProfits.get(key)?.Profits as Array<Profit>)
          }
          break
      }
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getProfits = (offset:number, limit: number) => {
  profit.getProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count === 0) {
      localledger.initProfit(profit.Profits.Profits)
      return
    }
    getProfits(limit + offset, limit)
  })
}

const getGoodProfits = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  profit.getGoodProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFIT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, key, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count === 0) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

onMounted(() => {
  if (profit.Profits.Total === 0) {
    getProfits(0, 100)
  }
  if (!profit.CoinProfits.get(IntervalKey.LastDay)) {
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (!profit.GoodProfits.get(IntervalKey.All)) {
    getGoodProfits(IntervalKey.All,
      0,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (!profit.GoodProfits.get(IntervalKey.LastDay)) {
    getGoodProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (order.Orders.Orders.length === 0) {
    getOrders(0, 100)
  }

  if (coin.ProductInfos.size === 0) {
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

  if (stock.Stocks.length === 0) {
    stock.getStocks({
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_STOCKS'),
          Message: t('MSG_GET_GOOD_STOCKS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

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
  }, (orders: Array<Order>, error: boolean) => {
    if (error || orders.length < limit) {
      return
    }
    getOrders(offset + limit, limit)
  })
}
</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
