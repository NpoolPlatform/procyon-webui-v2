<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <!-- <MiningCard v-for='myCoin in coins' :key='myCoin.ID' :coin-type-id='(myCoin.ID as string)' :good-general='getGoodGeneralByID(myCoin.ID as string) ' /> -->
  <MiningCard v-for='goodGeneral in goodGenerals' :key='goodGeneral.CoinTypeID' :coin-type-id='goodGeneral.CoinTypeID' :good-general='goodGeneral' />
  <SpacemeshMockCard />
</template>

<script setup lang='ts'>
import { useCoinStore, NotificationType, SecondsEachDay } from 'npool-cli-v2'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useLocalOrderStore } from 'src/teststore/mock/order'
import { useProfitStore } from 'src/teststore/mock/profit'
import { GoodGeneral } from 'src/localstore/good'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpacemeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const coin = useCoinStore()
// const orders = useOrderStore()
// const localOrder = useLocalOrderStore()
// const coins = computed(() => coin.Coins.filter((coin) => localOrder.Orders.find((order) => order.CoinTypeID === coin.ID)))

const goodGenerals = computed(() => {
  const result = [] as Array<GoodGeneral>
  profit.GoodProfits.forEach((el) => {
    const existItem = result.find((gel) => gel.CoinTypeID === el.CoinTypeID)
    if (!existItem) {
      result.push({ ...el, ...{ Last24Hours: 0 } })
    } else {
      existItem.Units += el.Units
      existItem.Incoming += Number(el.Incoming)
    }
  })
  // last24hours
  result.forEach((el) => {
    profit.IntervalGoodProfits.filter((gel) => gel.CoinTypeID === el.CoinTypeID).forEach((good) => { el.Last24Hours += Number(good.Incoming) })
  })
  return result
})

const profit = useProfitStore()
// const getGoodGeneralByID = (coinTypeID: string) => {
//   return goodGenerals.value.find((el) => el.CoinTypeID === coinTypeID) as GoodGeneral
// }
const getGoodProfitRecursive = (offset: number, limit: number) => {
  profit.getGoodProfits({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS'),
        Message: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (limit + offset >= profit.GoodProfitTotal) {
      return
    }
    // TODO
    getGoodProfitRecursive(limit + offset, limit)
  })
}
const getIntervalGoodProfitRecursive = (offset: number, limit: number, start: number, end: number) => {
  profit.getGoodProfits({
    StartAt: start,
    EndAt: end,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS'),
        Message: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (limit + offset >= profit.GoodProfitTotal) {
      return
    }
    // TODO
    getIntervalGoodProfitRecursive(start, end, limit + offset, limit)
  })
}
onMounted(() => {
  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS'),
          Message: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
      if (profit.GoodProfits.length === 0) {
        profit.GoodProfits = []
        getGoodProfitRecursive(0, 100)
      }
      profit.IntervalGoodProfits = []
      console.log('当前秒数: ', ~~(new Date().getTime() / 1000 - SecondsEachDay))
      getIntervalGoodProfitRecursive(0, 100, ~~(new Date().getTime() / 1000 - SecondsEachDay), ~~(new Date().getTime() / 1000))
    })
  }
})

</script>
