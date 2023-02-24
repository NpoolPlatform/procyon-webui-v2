<template>
  <OpTable
    label='MSG_ORDER_HISTORY'
    :rows='(orders as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
  >
    <template #top-right>
      <div class='buttons'>
        <button disabled class='alt last'>
          {{ $t('MSG_EXPORT_ORDER_CSV') }}
        </button>
      </div>
    </template>
  </OpTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { formatTime } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useFrontendOrderStore, Order, useAdminAppGoodStore } from 'npool-cli-v4'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useFrontendOrderStore()
const orders = computed(() => order.orders)

const good = useAdminAppGoodStore()

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: Order) => formatTime(row.CreatedAt)
  },
  {
    name: 'Product',
    label: t('MSG_PRODUCT'),
    align: 'center',
    field: (row: Order) => good.getGoodByID(row?.GoodID)?.DisplayNames?.[3] ? t(good.getGoodByID(row?.GoodID)?.DisplayNames?.[3] as string) : row.GoodName
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    field: (row: Order) => row.Units + t(row.GoodUnit)
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: Order) => (Number(row.PaymentAmount) + Number(row.PayWithBalanceAmount)).toString() + ' ' + row.PaymentCoinUnit
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    field: (row: Order) => row.GoodServicePeriodDays.toString() + t('MSG_DAY')
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    field: (row: Order) => order.getOrderState(row)?.startsWith('MSG') ? t(order.getOrderState(row)) : t('MSG_AWAITING_CONFIRMATION')
  }
])

</script>

<style lang='sass' scoped>
.last
  margin-right: 0
</style>
