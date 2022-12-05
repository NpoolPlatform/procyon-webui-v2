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
import { useAdminAppCoinStore, useAdminCurrencyStore, useFrontendProfitStore } from 'npool-cli-v4'
import { MyGoodProfit } from 'src/localstore/ledger'
import { IntervalKey } from 'src/const/const'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpaceMeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const currency = useAdminCurrencyStore()
const coin = useAdminAppCoinStore()

const profit = useFrontendProfitStore()
const goodProfits = computed(() => {
  return Array.from(profit.GoodProfits.GoodProfits).map((el) => {
    return {
      ...el,
      CoinPreSale: coin.preSale(el.CoinTypeID),
      TotalInComing: Number(el.Incoming),
      TotalUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * Number(el.Incoming),
      Last24HoursInComing: profit.getIntervalGoodProfitInComing(IntervalKey.LastDay, el.CoinTypeID),
      Last24HoursUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getIntervalGoodProfitInComing(IntervalKey.LastDay, el.CoinTypeID),
      Last30DaysInComing: profit.getIntervalGoodProfitInComing(IntervalKey.LastMonth, el.CoinTypeID),
      Last30DaysUSDInComing: currency.getUSDCurrency(el.CoinTypeID) * profit.getIntervalGoodProfitInComing(IntervalKey.LastMonth, el.CoinTypeID)
    } as MyGoodProfit
  })
})
</script>
