<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard v-for='myCoin in coins' :key='myCoin.ID' :coin-type-id='(myCoin.ID as string)' :good-general='getGoodGeneralByID(myCoin.ID as string) ' />
  <SpacemeshMockCard />
</template>

<script setup lang='ts'>
import { useCoinStore, useOrderStore, NotificationType } from 'npool-cli-v2'
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalOrderStore } from 'src/teststore/mock/order'
import { useProfitStore } from 'src/teststore/mock/profit'
import { GoodGeneral } from 'src/localstore/good'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpacemeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const coin = useCoinStore()
const orders = useOrderStore()
const localOrder = useLocalOrderStore()
const coins = computed(() => coin.Coins.filter((coin) => localOrder.Orders.find((order) => order.CoinTypeID === coin.ID)))

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
  // const start = new Date().getTime() / 1000 - SecondsEachDay
  // const end = new Date().getTime() / 1000
  // last24hours
  // not finished
  return result
})

const profit = useProfitStore()
const getGoodGeneralByID = (coinTypeID: string) => {
  return goodGenerals.value.find((el) => el.CoinTypeID === coinTypeID) as GoodGeneral
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
    })
  }

  if (orders.Orders.length === 0) {
    orders.getOrders({
      Message: {
        Error: {
          Title: t('MSG_GET_ORDERS'),
          Message: t('MSG_GET_ORDERS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
    localOrder.getOrders({
      Message: {
        Error: {
          Title: t('MSG_GET_ORDERS'),
          Message: t('MSG_GET_ORDERS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>
