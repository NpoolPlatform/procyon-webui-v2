<template>
  <!-- <OpTable
    label='MSG_ORDER_HISTORY'
    :rows='(myOrders as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
    @row-click='(row) => onRowClick(row as OrderModel)'
  >
    <template #top-right>
      <div class='buttons'>
        <button disabled class='alt last'>
          {{ $t('MSG_EXPORT_ORDER_CSV') }}
        </button>
      </div>
    </template>
  </OpTable>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
    skip-hijack
  /> -->
  <OpTable
    label='MSG_ORDER_HISTORY'
    :rows='(localOrders as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
    @row-click='(row) => onRowClick(row as LocalOrder)'
  >
    <template #top-right>
      <div class='buttons'>
        <button disabled class='alt last'>
          {{ $t('MSG_EXPORT_ORDER_CSV') }}
        </button>
      </div>
    </template>
  </OpTable>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
    skip-hijack
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent, ref, onUnmounted } from 'vue'
import { formatTime } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'
import { LocalOrder, useLocalOrderStore } from 'src/teststore/mock/order'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const localOrder = useLocalOrderStore()
const localOrders = computed(() => localOrder.Orders)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: LocalOrder) => formatTime(row.CreatedAt)
  },
  {
    name: 'Product',
    label: t('MSG_PRODUCT'),
    align: 'center',
    field: (row: LocalOrder) => row.GoodName
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    // field: (row: LocalOrder) => row.Units.toString() + (good.getGoodByID(row.GoodID)?.Good?.Good?.Unit?.length ? t(good.getGoodByID(row.GoodID)?.Good?.Good?.Unit) : '')
    // FIXME: 商品单位
    field: (row: LocalOrder) => row.Units.toString() + t(row.GoodUnit)
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    // FIXME: 商品价格,是否需要将其转为USDT
    // field: (row: LocalOrder) => orderPrice(row.PaymentAmount)
    field: (row: LocalOrder) => row.PaymentAmount
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    // FIXME: 商品周期需要返回
    // field: (row: LocalOrder) => row.DurationDays.toString() + t('MSG_DAY')
    field: (row: LocalOrder) => row.Units.toString() + t('MSG_DAY')
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    // FIXME: 订单状态需要重写
    field: (row: LocalOrder) => t(row.State)
  }
])

const router = useRouter()

const onRowClick = (myOrder: LocalOrder) => {
  // if (!order.validateOrder(order.getOrderByID(myOrder.OrderID))) {
  //   return
  // }
  if (!localOrder.validateOrder(localOrder.getOrderByID(myOrder.ID) as LocalOrder)) {
    return
  }
  void router.push({
    path: '/payment',
    query: {
      paymentId: localOrder.getOrderByID(myOrder.ID)?.PaymentID,
      orderId: myOrder.ID
    }
  })
}

const ticker = ref(-1)
const progress = ref<QAjaxBar>()

onMounted(() => {
  ticker.value = window.setInterval(() => {
    // TODO: update order state
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
