<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard
    v-for='goodProfit in goodProfits'
    :key='goodProfit.CoinTypeID'
    :profit='goodProfit'
  />
  <!-- <SpaceMeshMockCard /> -->
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { IntervalKey } from 'src/const/const'
import { MyGoodProfit } from 'src/localstore'
import { appgood, appcoin, coincurrency, ledgerprofit, user, utils } from 'src/npoolstore'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
// const SpaceMeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const currency = coincurrency.useCurrencyStore()
const coin = appcoin.useAppCoinStore()
const logined = user.useLocalUserStore()

const good = appgood.useAppGoodStore()
const getTBD = computed(() => (goodID:string) => {
  const _good = good.good(undefined, goodID)
  return _good?.Descriptions?.[5] || '*'
})

const profit = ledgerprofit.useProfitStore()
const goodProfits = computed(() => Array.from(profit.goodProfits(undefined, logined.loginedUserID)).map((el) => {
  const _good = good.good(undefined, el.AppGoodID) as appgood.Good
  const now = Math.floor(Date.now() / 1000)

  const remain = now - _good?.ServiceStartAt >= 0 ? now - _good?.ServiceStartAt : 0
  const daysMined = Math.floor(remain / 24 / 60 / 60)

  const daysRemaining = el.GoodServicePeriodDays - daysMined > 0 ? el.GoodServicePeriodDays - daysMined : 0
  return {
    ...el,
    Units: el.Units,
    CoinPreSale: coin.preSale(undefined, el.CoinTypeID),
    TotalInComing: profit.totalIncoming(undefined, logined.loginedUserID, el.CoinTypeID, el.AppGoodID),
    TotalUSDInComing: currency.currency(el.CoinTypeID) * profit.totalIncoming(undefined, logined.loginedUserID, el.CoinTypeID, el.AppGoodID),
    Last24HoursInComing: profit.intervalGoodIncoming(undefined, logined.loginedUserID, IntervalKey.LastDay, el.CoinTypeID, el.AppGoodID),
    Last24HoursUSDInComing: currency.currency(el.CoinTypeID) * profit.intervalGoodIncoming(undefined, logined.loginedUserID, IntervalKey.LastDay, el.CoinTypeID, el.AppGoodID),
    Last30DaysInComing: profit.intervalGoodIncoming(undefined, logined.loginedUserID, IntervalKey.LastMonth, el.CoinTypeID, el.AppGoodID),
    Last30DaysUSDInComing: currency.currency(el.CoinTypeID) * profit.intervalGoodIncoming(undefined, logined.loginedUserID, IntervalKey.LastMonth, el.CoinTypeID, el.AppGoodID),
    TotalEstimatedDailyReward: Number(el.Units) * parseFloat(good.good(undefined, el.AppGoodID)?.DailyRewardAmount as string),
    GoodSaleEndAt: _good?.SaleEndAt,
    MiningStartDate: _good?.ServiceStartAt > Math.ceil(Date.now() / 1000) ? getTBD.value(el.AppGoodID) : utils.formatTime(_good?.ServiceStartAt, 'YYYY-MM-DD', 9),
    DaysMined: daysMined > el.GoodServicePeriodDays ? el.GoodServicePeriodDays : daysMined,
    DaysRemaining: daysRemaining
  } as MyGoodProfit
}).sort((a, b) => {
  if (a.CoinUnit.localeCompare(b.CoinUnit, 'zh-CN')) {
    return a.CoinUnit.localeCompare(b.CoinUnit, 'zh-CN')
  } else {
    return a.GoodSaleEndAt > b.GoodSaleEndAt ? -1 : 1
  }
}))
</script>
