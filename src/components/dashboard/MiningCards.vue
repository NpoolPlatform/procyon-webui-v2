<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard
    v-for='goodProfit in goodProfits'
    :key='goodProfit.CoinTypeID'
    :profit='goodProfit'
  />
  <SpaceMeshMockCard />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { AppGood, useAdminAppCoinStore, useAdminAppGoodStore, useAdminCurrencyStore, useFrontendProfitStore } from 'npool-cli-v4'
import { IntervalKey } from 'src/const/const'
import { MyGoodProfit } from 'src/localstore/ledger/types'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpaceMeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const currency = useAdminCurrencyStore()
const coin = useAdminAppCoinStore()
const good = useAdminAppGoodStore()

const profit = useFrontendProfitStore()
const goodProfits = computed(() => Array.from(profit.GoodProfits.GoodProfits).map((el) => {
  const _good = good.getGoodByID(el.GoodID) as AppGood
  const now = Math.floor(Date.now() / 1000)

  const remain = now - _good?.ServiceStartAt >= 0 ? now - _good?.ServiceStartAt : 0
  const daysMined = Math.floor(remain / 24 / 60 / 60)

  const daysRemaining = el.GoodServicePeriodDays - daysMined > 0 ? el.GoodServicePeriodDays - daysMined : 0
  return {
    ...el,
    Units: el.Units,
    CoinPreSale: coin.preSale(el.CoinTypeID),
    TotalInComing: profit.getGoodTotalIncoming(el.CoinTypeID, el.GoodID),
    TotalUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getGoodTotalIncoming(el.CoinTypeID, el.GoodID),
    Last24HoursInComing: profit.getGoodIntervalProfitInComing(IntervalKey.LastDay, el.CoinTypeID, el.GoodID),
    Last24HoursUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getGoodIntervalProfitInComing(IntervalKey.LastDay, el.CoinTypeID, el.GoodID),
    Last30DaysInComing: profit.getGoodIntervalProfitInComing(IntervalKey.LastMonth, el.CoinTypeID, el.GoodID),
    Last30DaysUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getGoodIntervalProfitInComing(IntervalKey.LastMonth, el.CoinTypeID, el.GoodID),
    TotalEstimatedDailyReward: Number(el.Units) * parseFloat(good.getGoodByID(el.GoodID)?.DailyRewardAmount as string),
    GoodSaleEndAt: _good?.SaleEndAt,
    MiningStartDate: _good?.ServiceStartAt > Math.ceil(Date.now() / 1000) ? '****-**-**' : good.getJSTDate(_good?.ServiceStartAt, 'YYYY-MM-DD'),
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
console.log(Math.ceil(Date.now() / 1000))
</script>
