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
import { useFrontendOrderStore, Order, useAdminAppGoodStore, OrderState, PriceCoinName } from 'npool-cli-v4'
import { stringify } from 'csv-stringify/sync'
import saveAs from 'file-saver'

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
  Currency: string;
  TotalCost: string;
  MiningPeriod: number;
  ProverIncentive?: number;
  VerifierIncentive?: string;
  OrderStatus: OrderState;
}

const exportOrders = computed(() => Array.from(orders.value).map((el) => {
  return {
    CreatedAt: new Date(el.CreatedAt * 1000).toISOString()?.replace('T', ' ')?.replace('.000Z', ' UTC'),
    ProductType: good.getGoodByID(el.GoodID)?.GoodType,
    ProductName: good.getGoodByID(el?.GoodID)?.DisplayNames?.[3] ? t(good.getGoodByID(el?.GoodID)?.DisplayNames?.[3] as string) : el.GoodName,
    PurchaseAmount: el.Units,
    UnitType: el.GoodUnit,
    Price: parseFloat(good.getGoodByID(el.GoodID)?.Price as string),
    Currency: PriceCoinName,
    TotalCost: (Number(el.PaymentAmount) + Number(el.PayWithBalanceAmount)).toString() + '' + el.PaymentCoinUnit,
    MiningPeriod: el.GoodServicePeriodDays,
    ProverIncentive: Number(good.getGoodByID(el.GoodID)?.DailyRewardAmount) * Number(el.Units),
    // VerifierIncentive: '',
    OrderStatus: el.State
  } as ExportOrder
}))

const onExportClick = () => {
  const output = stringify(exportOrders.value, {
    header: true,
    columns: {
      CreatedAt: 'Order Date',
      ProductType: 'Product Type',
      ProductName: 'Product Name',
      PurchaseAmount: 'Purchase Amount',
      UnitType: 'Unit Type',
      Price: 'Price',
      Currency: 'Currency',
      TotalCost: 'Total Cost',
      MiningPeriod: 'Mining Period',
      ProverIncentive: 'Prover Incentive',
      OrderStatus: 'Order Status'
    }
  })

  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
  const filename = 'orders-' + '-' + formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

</script>

<style lang='sass' scoped>
.last
  margin-right: 0
</style>
