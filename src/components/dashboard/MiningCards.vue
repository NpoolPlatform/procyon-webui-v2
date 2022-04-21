<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard v-for='myCoin in coins' :key='myCoin.ID' :coin-type-id='(myCoin.ID as string)' />
  <SpacemeshMockCard />
</template>

<script setup lang='ts'>
import { useCoinStore, useOrderStore, NotificationType } from 'npool-cli-v2'
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))
const SpacemeshMockCard = defineAsyncComponent(() => import('src/components/dashboard/SpacemeshMockCard.vue'))

const coin = useCoinStore()
const orders = useOrderStore()

const coins = computed(() => coin.Coins.filter((coin) => {
  for (const order of orders.Orders) {
    if (coin.ID === order.Good.Main?.ID) {
      return true
    }
  }
  return false
}))

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
  }
})

</script>
