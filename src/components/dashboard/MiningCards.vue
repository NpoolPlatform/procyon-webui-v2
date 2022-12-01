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
import { useFrontendProfitStore } from 'npool-cli-v4'
import { MyGoodProfit } from 'src/localstore/ledger'
import { IntervalKey } from 'src/const/const'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpaceMeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const profit = useFrontendProfitStore()
const goodProfits = computed(() => {
  return Array.from(profit.GoodProfits.GoodProfits).map((el) => {
    return {
      ...el,
      CoinPreSale: false,
      TotalInComing: Number(el.Incoming),
      TotalUSDInComing: 1,
      Last24HoursInComing: profit.getIntervalGoodProfitIncoming(IntervalKey.LastDay, el.CoinTypeID),
      Last24HoursUSDInComing: 1,
      Last30DaysInComing: profit.getIntervalGoodProfitIncoming(IntervalKey.LastMonth, el.CoinTypeID),
      Last30DaysUSDInComing: 1
    } as MyGoodProfit
  })
})
</script>
