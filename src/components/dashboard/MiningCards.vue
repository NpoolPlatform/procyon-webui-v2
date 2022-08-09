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
import { NotificationType } from 'npool-cli-v2'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfitStore } from 'src/teststore/mock/profit'
import { GoodGeneral } from 'src/localstore/good'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpacemeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const profit = useProfitStore()

enum IntervalKey {
  All = 'All',
  LastDay = 'LastDay',
  LastMonth = 'LastMonty'
}

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
  // const start = new Date().getTime() / 1000 - SecondsEachDay
  // const end = new Date().getTime() / 1000
  // last24hours
  // not finished
  return result
})

const getProfits = (key: IntervalKey, offset: number, limit: number) => {
  profit.getGoodProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROFITS'),
        Message: t('MSG_GET_PROFITS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, key, () => {
    if (profit.GoodProfits.get(key)?.Total === profit.GoodProfits.get(key)?.Profits?.length) {
      return
    }
    getProfits(key, offset + limit, limit)
  })
}

onMounted(() => {
  if (profit.Profits.Total === 0) {
    getProfits(IntervalKey.All, 0, 100)
    getProfits(IntervalKey.LastDay, 0, 100)
  }
})

</script>
