<template>
  <OpTable
    label='MSG_ORDER_HISTORY'
    :rows='(orders as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
    @row-click='(row) => onRowClick(row as Order)'
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
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { formatTime, PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Order, useLocalOrderStore, OrderState } from 'src/teststore/mock/order'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useLocalOrderStore()
const orders = computed(() => order.orders)

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
    field: (row: Order) => row.GoodName
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    field: (row: Order) => row.Units.toString() + t(row.GoodUnit)
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: Order) => row.PaymentAmount.toString() + ' ' + PriceCoinName
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
    field: (row: Order) => stateMap?.value.get(row.ID)?.length ? t(stateMap?.value.get(row.ID) as string) : ''
  }
])

const router = useRouter()

const onRowClick = (myOrder: Order) => {
  if (!order.validateOrder(order.getOrderByID(myOrder.ID) as Order)) {
    return
  }
  switch (myOrder.State) {
    case OrderState.IN_SERVICE:
    case OrderState.EXPIRED:
      return
  }
  void router.push({
    path: '/payment',
    query: {
      paymentId: order.getOrderByID(myOrder.ID)?.PaymentID,
      orderId: myOrder.ID
    }
  })
}

const stateMap = ref(new Map<string, string>())

const ticker = ref(-1)

onMounted(() => {
  ticker.value = window.setInterval(() => {
    orders.value.forEach((el: Order) => {
      stateMap.value.set(el.ID, order.getOrderState(el))
    })
    ticker.value += 1
  }, 1000)
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

</script>

<stype lang='sass' scoped>
.last
  margin-right: 0
</stype>
