<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard
    v-for='general in goodGenerals'
    :key='general.CoinTypeID'
    :general='general'
  />
  <SpacemeshMockCard />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { useProfitStore } from 'src/teststore/mock/profit'
import { GoodGeneral } from 'src/localstore/good'
import { IntervalKey } from 'src/const/const'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpacemeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const profit = useProfitStore()

const goodGenerals = computed(() => {
  const result = [] as Array<GoodGeneral>
  const goodProfits = profit.GoodProfits.get(IntervalKey.All)
  if (!goodProfits) {
    return result
  }

  goodProfits.Profits.forEach((el) => {
    const existItem = result.find((gel) => gel.CoinTypeID === el.CoinTypeID)
    if (!existItem) {
      result.push({ ...el, ...{ Last24HoursIncoming: 0 } })
    } else {
      existItem.Units += el.Units
      existItem.Incoming += Number(el.Incoming)
    }
  })
  return result
})

</script>
