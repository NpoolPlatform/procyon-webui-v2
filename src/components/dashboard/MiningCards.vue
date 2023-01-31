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
import { useAdminAppCoinStore, useAdminAppGoodStore, useAdminCurrencyStore, useFrontendProfitStore } from 'npool-cli-v4'
import { IntervalKey } from 'src/const/const'
import { MyGoodProfit } from 'src/localstore/ledger/types'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpaceMeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const currency = useAdminCurrencyStore()
const coin = useAdminAppCoinStore()
const good = useAdminAppGoodStore()

const profit = useFrontendProfitStore()
const goodProfits = computed(() => Array.from(profit.GoodProfits.GoodProfits).map((el) => {
  return {
    ...el,
    Units: el.Units,
    CoinPreSale: coin.preSale(el.CoinTypeID),
    TotalInComing: profit.getTotalIncoming(el.CoinTypeID),
    TotalUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getTotalIncoming(el.CoinTypeID),
    Last24HoursInComing: profit.getIntervalGoodProfitInComing(IntervalKey.LastDay, el.CoinTypeID),
    Last24HoursUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getIntervalGoodProfitInComing(IntervalKey.LastDay, el.CoinTypeID),
    Last30DaysInComing: profit.getIntervalGoodProfitInComing(IntervalKey.LastMonth, el.CoinTypeID),
    Last30DaysUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getIntervalGoodProfitInComing(IntervalKey.LastMonth, el.CoinTypeID),
    TotalEstimatedDailyReward: el.Units * Number(good.getGoodByID(el.GoodID)?.EstimatedDailyReward)
  } as MyGoodProfit
}))
</script>
