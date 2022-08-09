<template>
  <div class='content'>
    <MiningSummary />
    <div class='hr' />
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { useProfitStore } from 'src/teststore/mock/profit'
import { defineAsyncComponent, onMounted } from 'vue'
import { NotificationType, SecondsEachDay } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { IntervalKey } from 'src/const/const'
import { useLocalOrderStore } from 'src/teststore/mock/order'

const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const profit = useProfitStore()
const order = useLocalOrderStore()

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
  }, key, () => {
    if (profit.CoinProfits.get(key)?.Profits?.length === profit.CoinProfits.get(key)?.Total) {
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
  }, () => {
    if (profit.Profits.Total === profit.Profits.Profits.length) {
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
  }, key, () => {
    if (profit.CoinProfits.get(key)?.Profits?.length === profit.CoinProfits.get(key)?.Total) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
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
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (order.Orders.length === order.Total) {
      return
    }
    getOrders(offset + limit, limit)
  })
}

onMounted(() => {
  if (profit.Profits.Total === 0) {
    getProfits(0, 100)
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
    getGoodProfits(IntervalKey.All,
      0,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
    getGoodProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }

  if (order.Orders.length === 0) {
    getOrders(0, 100)
  }
})
</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
