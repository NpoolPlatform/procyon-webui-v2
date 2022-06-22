<template>
  <OpTable
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
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent, ref, onUnmounted } from 'vue'
import { useOrderStore, buildOrders, OrderGroup, OrderModel, useGoodStore, formatTime, NotificationType, PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const orders = computed(() => buildOrders(order.Orders, OrderGroup.ALL))
const myOrders = ref([] as Array<OrderModel>)

const good = useGoodStore()

const orderPrice = (orderModel: OrderModel) => {
  const myOrder = order.getOrderByID(orderModel.OrderID)
  if (!myOrder || !myOrder.Order.Payment) {
    return t('MSG_NOT_AVAILABLE')
  }
  const currency = myOrder.Order.Payment.CoinUSDCurrency ? myOrder.Order.Payment.CoinUSDCurrency : 1
  const totalPay = currency * myOrder.Order.Payment.Amount
  const price = totalPay / myOrder.Order.Order.Units
  return price.toString() + ' ' + PriceCoinName
}

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: OrderModel) => formatTime(row.CreateAt)
  },
  {
    name: 'Product',
    label: t('MSG_PRODUCT'),
    align: 'center',
    field: (row: OrderModel) => row.GoodTitle
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    field: (row: OrderModel) => row.Units.toString() + (good.getGoodByID(row.GoodID)?.Good?.Good?.Unit?.length ? t(good.getGoodByID(row.GoodID)?.Good?.Good?.Unit) : '')
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: OrderModel) => orderPrice(row)
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    field: (row: OrderModel) => row.DurationDays.toString() + t('MSG_DAY')
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    field: (row: OrderModel) => t(row.State)
  }
])

const router = useRouter()

const onRowClick = (myOrder: OrderModel) => {
  if (!order.validateOrder(order.getOrderByID(myOrder.OrderID))) {
    return
  }
  void router.push({
    path: '/payment',
    query: {
      paymentId: order.getOrderByID(myOrder.OrderID)?.Order?.Payment?.ID,
      orderId: myOrder.OrderID
    }
  })
}

const ticker = ref(-1)
const progress = ref<QAjaxBar>()

onMounted(() => {
  progress.value?.start()

  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    progress.value?.stop()
    if (error) {
      return
    }

    progress.value?.start()

    good.getPromotions({
      Message: {
        Error: {
          Title: t('MSG_GET_PROMOTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (error: boolean) => {
      progress.value?.stop()
      if (error) {
        return
      }

      progress.value?.start()

      good.getAppGoods({
        Message: {
          Error: {
            Title: t('MSG_GET_APP_GOODS_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, (error: boolean) => {
        progress.value?.stop()
        if (error) {
          return
        }

        progress.value?.start()

        if (order.Orders.length === 0) {
          order.getOrders({
            Message: {
              Error: {
                Title: t('MSG_GET_ORDERS_FAIL'),
                Popup: true,
                Type: NotificationType.Error
              }
            }
          }, () => {
            progress.value?.stop()
          })
        }
      })
    })
  })

  ticker.value = window.setInterval(() => {
    myOrders.value = [] as Array<OrderModel>
    orders.value.forEach((myOrder) => {
      myOrder.State = order.getOrderState(order.getOrderByID(myOrder.OrderID))
      myOrders.value.push(myOrder)
    })
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
