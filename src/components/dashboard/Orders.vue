<template>
  <OpTable
    label='MSG_ORDER_HISTORY'
    :rows='(orders as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
  >
    <template #top-right>
      <div class='buttons'>
        <button class='alt last' :disabled='exportOrders.length === 0' @click='onExportClick'>
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
import { useFrontendOrderStore, Order, useAdminAppGoodStore, OrderState, useFrontendDetailStore, GoodType } from 'npool-cli-v4'
import { stringify } from 'csv-stringify/sync'
import saveAs from 'file-saver'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useFrontendOrderStore()
const orders = computed(() => order.orders)

const detail = useFrontendDetailStore()

const good = useAdminAppGoodStore()
const getDeservedRatio = computed(() => (goodID: string) => 1 - Number(good.getGoodByID(goodID)?.TechnicalFeeRatio) / 100)

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
    field: (row: Order) => `${parseFloat(row.Units)} ${t(row.GoodUnit)}`
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

interface ExportOrder {
  CreatedAt: string;
  ProductType: string;
  ProductName: string;
  PurchaseAmount: string;
  UnitType: string;
  Price: number;
  PaymentCurrency: string;
  TotalCost: string;
  MiningPeriod: number;
  CumulativeProfit: number;
  ProfitCurrency: string;
  OrderStatus: OrderState;
}

const getGoodType = computed(() => (goodID:string) => {
  const _good = good.getGoodByID(goodID)
  return _good?.GoodType === GoodType.GoodTypeClassicMining || _good?.GoodType === GoodType.GoodTypeUnionMining ? 'Mining' : _good?.GoodType
})

const exportOrders = computed(() => Array.from(orders.value.filter((el) => el.State === OrderState.PAID ||
  el.State === OrderState.IN_SERVICE ||
  el.State === OrderState.EXPIRED ||
  el.State === OrderState.WAIT_START
)).map((el) => {
  return {
    CreatedAt: new Date(el.CreatedAt * 1000).toISOString()?.replace('T', ' ')?.replace('.000Z', ' UTC'),
    ProductType: getGoodType.value(el.GoodID),
    ProductName: good.getGoodByID(el?.GoodID)?.DisplayNames?.[3] ? t(good.getGoodByID(el?.GoodID)?.DisplayNames?.[3] as string) : el.GoodName,
    PurchaseAmount: el.Units,
    UnitType: t(el.GoodUnit),
    Price: parseFloat(good.getGoodByID(el.GoodID)?.Price as string),
    PaymentCurrency: el.PaymentCoinUnit,
    TotalCost: (Number(el.PaymentAmount) + Number(el.PayWithBalanceAmount)).toString(),
    MiningPeriod: el.GoodServicePeriodDays,
    CumulativeProfit: detail.getMiningRewardsByOrderID(el.ID) / getDeservedRatio.value(el.GoodID),
    ProfitCurrency: good.getGoodByID(el.GoodID)?.CoinUnit,
    OrderStatus: order.getOrderState(el)?.startsWith('MSG') ? t(order.getOrderState(el)) : t('MSG_AWAITING_CONFIRMATION')
  } as ExportOrder
}))

const onExportClick = () => {
  const output = stringify(exportOrders.value, {
    header: true,
    columns: {
      CreatedAt: `${t('MSG_ORDER_DATE_IN_TEMPLATE')}`,
      ProductType: `${t('MSG_PRODUCT_TYPE_IN_TEMPLATE')}`,
      ProductName: `${t('MSG_PRODUCT_NAME_IN_TEMPLATE')}`,
      PurchaseAmount: `${t('MSG_PURCHASE_AMOUNT_IN_TEMPLATE')}`,
      UnitType: `${t('MSG_UNIT_TYPE_IN_TEMPLATE')}`,
      Price: `${t('MSG_PRICE_IN_TEMPLATE')}`,
      PaymentCurrency: `${t('MSG_PAYMENT_CURRENCY_IN_TEMPLATE')}`,
      TotalCost: `${t('MSG_TOTAL_COST_IN_TEMPLATE')}`,
      MiningPeriod: `${t('MSG_MINING_PERIOD_IN_TEMPLATE')}`,
      CumulativeProfit: `${t('MSG_CUMULATIVE_PROFIT_IN_TEMPLATE')}`,
      ProfitCurrency: `${t('MSG_PROFIT_CURRENCY_IN_TEMPLATE')}`,
      OrderStatus: `${t('MSG_ORDER_STATUS_IN_TEMPLATE')}`
    }
  })

  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
  const filename = 'orders-' + formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

</script>

<style lang='sass' scoped>
.last
  margin-right: 0
</style>
