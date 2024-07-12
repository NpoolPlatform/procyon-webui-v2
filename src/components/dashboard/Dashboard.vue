<template>
  <div class='content'>
    <!-- <MiningSummary /> -->
    <!-- <div class='hr' /> -->
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
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IntervalKey } from 'src/const/const'
import { QAjaxBar } from 'quasar'
import { ledgerprofit, notify, constant, appcoin, coincurrency, ledgerstatement, user, sdk } from 'src/npoolstore'
import { getCoins, getCurrencies } from 'src/api/chain'

// const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const profit = ledgerprofit.useProfitStore()
const coin = appcoin.useAppCoinStore()
const currency = coincurrency.useCurrencyStore()
const logined = user.useLocalUserStore()

const detail = ledgerstatement.useStatementStore()
const miningRewards = computed(() => detail.miningRewards(undefined, logined.loginedUserID))

onMounted(() => {
  if (!profit.profits(undefined, logined.loginedUserID).length) {
    getProfits(0, 100)
  }
  if (!profit.intervalProfits(undefined, logined.loginedUserID, undefined, IntervalKey.LastDay).length) {
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - constant.SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }

  if (!profit.goodProfits(undefined, logined.loginedUserID).length) {
    getGoodProfits(0, 100, 0, Math.ceil(new Date().getTime() / 1000))
  }
  if (!profit.intervalGoodProfits(undefined, logined.loginedUserID, IntervalKey.LastDay).length) {
    getIntervalGoodProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - constant.SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (!profit.intervalGoodProfits(undefined, logined.loginedUserID, IntervalKey.LastMonth).length) {
    getIntervalGoodProfits(
      IntervalKey.LastMonth,
      Math.ceil(new Date().getTime() / 1000) - (constant.SecondsEachDay * 30),
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }

  if (!sdk.powerRentalOrders.value?.length) {
    sdk.getPowerRentalOrders(0, 0)
  }

  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }
  if (!currency.currencies()) {
    getCurrencies(0, 100)
  }

  if (miningRewards.value?.length === 0) {
    getMiningRewards(0, 100)
  }
})

const getProfits = (offset:number, limit: number) => {
  profit.getProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_PROFIT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ledgerprofit.Profit>) => {
    if (error || !rows.length) {
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
        Title: 'MSG_GET_PROFIT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<ledgerprofit.Profit>) => {
    if (error || !rows.length) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getGoodProfits = (offset: number, limit: number, startAt: number, endAt: number) => {
  profit.getGoodProfits({
    Offset: offset,
    Limit: limit,
    StartAt: startAt,
    EndAt: endAt,
    Message: {
      Error: {
        Title: 'MSG_GET_PROFIT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ledgerprofit.GoodProfit>) => {
    if (error || !rows.length) {
      return
    }
    getGoodProfits(limit + offset, limit, startAt, endAt)
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
        Title: 'MSG_GET_PROFIT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<ledgerprofit.GoodProfit>) => {
    if (error || !rows.length) {
      return
    }
    getIntervalGoodProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getMiningRewards = (offset: number, limit: number) => {
  detail.getMiningRewards({
    Offset: offset,
    Limit: limit,
    EndAt: Math.ceil(Date.now() / 1000),
    Message: {
      Error: {
        Title: t('MSG_REWARD_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<ledgerstatement.MiningReward>) => {
    if (error || !rows?.length) {
      return
    }
    getMiningRewards(limit + offset, limit)
  })
}

</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
