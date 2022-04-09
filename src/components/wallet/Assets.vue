<template>
  <ShowSwitchTable
    label='MSG_ASSETS'
    :rows='(benefits as Array<never>)'
    :table='(table as never)'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useOrderStore, NotificationType, useBenefitStore, buildBenefits, useCoinStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const coin = useCoinStore()
const benefit = useBenefitStore()
const benefits = computed(() => buildBenefits(order.Orders, benefit.Benefits))

const table = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: 'Name'
  },
  {
    name: 'Balance',
    label: t('MSG_BALANCE'),
    align: 'center',
    field: 'Balance'
  },
  {
    name: 'Last24HoursIncoming',
    label: t('MSG_24_HOUR_CHANGE'),
    align: 'center',
    field: 'Last24HoursIncoming'
  },
  {
    name: 'USDTValue',
    label: t('MSG_MARKET_VALUE_USDT'),
    align: 'center',
    field: 'USDTValue'
  },
  {
    name: 'JPYValue',
    label: t('MSG_MARKET_VALUE_JPY'),
    align: 'center',
    field: 'JPYValue'
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center'
  }
])

onMounted(() => {
  if (order.Orders.length === 0) {
    order.getOrders({
      Message: {
        Error: {
          Title: t('MSG_GET_ORDERS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }

  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (benefit.Benefits.length === 0) {
    benefit.getBenefits({
      Message: {
        Error: {
          Title: t('MSG_GET_BENEFITS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

</script>

<stype lang='sass' scoped>
</stype>
