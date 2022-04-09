<template>
  <h2>{{ $t('MSG_ORDER_HISTORY') }}</h2>
  <q-table
    flat
    class='table-box'
    :rows='orders'
    :columns='table'
    row-key='ID'
    color='#e1eeef'
    :no-data-label='$t("NoData")'
    :rows-per-page-options='[10, 15, 20, 25]'
    @row-click='(evt, row, index) => onRowClick(row as OrderModel)'
  />

  <button disabled>
    {{ $t('MSG_EXPORT_ORDER_CSV') }}
  </button>
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useOrderStore, buildOrders, OrderGroup, OrderModel, useGoodStore, formatTime, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const orders = computed(() => buildOrders(order.Orders, OrderGroup.ALL))

const good = useGoodStore()

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
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    align: 'center',
    field: (row: OrderModel) => row.Units
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: OrderModel) => good.getGoodPrice(good.getGoodByID(row.GoodID)).toString() + ' USDT'
  },
  {
    name: 'TechFee',
    label: t('MSG_TECHNIQUE_SERVICE_FEE'),
    align: 'center',
    field: () => '20%'
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    field: (row: OrderModel) => row.DurationDays.toString() + t('MSG_DAY')
  },
  {
    name: 'Total',
    label: t('MSG_TOTAL'),
    align: 'center',
    field: (row: OrderModel) => row.Units.toString() + good.getGoodByID(row.GoodID)?.Good.Good.Unit
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    field: (row: OrderModel) => order.getOrderState(order.getOrderByID(row.OrderID))
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
      paymentId: order.getOrderByID(myOrder.OrderID)?.Order.Payment?.ID,
      orderId: myOrder.OrderID
    }
  })
}

onMounted(() => {
  if (good.Goods.length < 0) {
    good.getGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })

    good.getPromotions({
      Message: {
        Error: {
          Title: t('MSG_GET_PROMOTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })

    good.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

</script>

<stype lang='sass' scoped>
.table-box
  background: linear-gradient(to bottom right,rgba(225, 238, 239, 0.2) 0,rgba(161, 208, 208, 0.2) 100%)
  box-shadow: 16px 16px 20px 0 #23292b
  border-radius: 12px
  color: #e1eeef

.table-box >>> th
  font-size: 16px !important
</stype>
