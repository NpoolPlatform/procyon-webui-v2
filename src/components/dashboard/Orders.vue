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
import { useI18n } from 'vue-i18n'
import { utils, order, ledgerstatement, goodbase, user, constant, sdk, powerrentalorder } from 'src/npoolstore'
import { stringify } from 'csv-stringify/sync'
import saveAs from 'file-saver'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = user.useLocalUserStore()

const orders = computed(() => sdk.powerRentalOrders.value)

const detail = ledgerstatement.useStatementStore()

const getDeservedRatio = computed(() => (appGoodID: string) => 1 - Number(sdk.appPowerRental(appGoodID)?.TechniqueFeeRatio) / 100)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: powerrentalorder.PowerRentalOrder) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'Product',
    label: t('MSG_PRODUCT'),
    align: 'center',
    field: (row: powerrentalorder.PowerRentalOrder) => sdk.displayName(row.AppGoodID, 3).length > 0 ? t(sdk.displayName(row.AppGoodID, 3)) : row.GoodName
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    field: (row: powerrentalorder.PowerRentalOrder) => `${utils.getLocaleString(parseFloat(row.Units))} ${t(row.Unit)}`
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: powerrentalorder.PowerRentalOrder) => utils.getLocaleString(Number(row.GoodValueUSD)) + ' ' + constant.PriceCoinName
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    field: (row: powerrentalorder.PowerRentalOrder) => utils.getLocaleString(row.Durations) + ' ' + t('MSG_DAYS')
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    field: (row: powerrentalorder.PowerRentalOrder) => {
      let orderType = undefined as unknown as order.OrderType
      if (row.OrderType === order.OrderType.Offline) {
        orderType = order.OrderType.Offline
      } else if (row.OrderType === order.OrderType.Airdrop) {
        orderType = order.OrderType.Airdrop
      }
      return (sdk.orderState(row.OrderID)?.startsWith('MSG') ? t(sdk.orderState(row.OrderID)) : t('MSG_AWAITING_CONFIRMATION')) +
            (orderType ? ' (' + orderType + ')' : '')
    }
  }
])

interface ExportOrder {
  CreatedAt: string
  ProductType: string
  ProductName: string
  PurchaseAmount: string
  UnitType: string
  Price: number
  PaymentCurrency: string
  TotalCost: string
  MiningPeriod: number
  CumulativeProfit: number
  ProfitCurrency: string
  OrderStatus: order.OrderState
}

const getGoodType = computed(() => (appGoodID: string) => {
  const _good = sdk.appPowerRental(appGoodID)
  return _good?.GoodType === goodbase.GoodType.PowerRental || _good?.GoodType === goodbase.GoodType.MachineRental ? 'Mining' : _good?.GoodType
})

const exportOrders = computed(() => Array.from(orders.value.filter((el) => {
  return el.OrderState === order.OrderState.PAID ||
        el.OrderState === order.OrderState.IN_SERVICE ||
        el.OrderState === order.OrderState.EXPIRED ||
        el.OrderState === order.OrderState.WAIT_START
})).map((el) => {
  let orderType = undefined as unknown as order.OrderType
  if (el.OrderType === order.OrderType.Offline) {
    orderType = order.OrderType.Offline
  } else if (el.OrderType === order.OrderType.Airdrop) {
    orderType = order.OrderType.Airdrop
  }
  return {
    CreatedAt: new Date(el.CreatedAt * 1000).toISOString()?.replace('T', ' ')?.replace('.000Z', ' UTC'),
    ProductType: getGoodType.value(el.AppGoodID),
    ProductName: sdk.displayName(el.AppGoodID, 3)?.length > 0 ? t(sdk.displayName(el.AppGoodID, 3)) : el.GoodName,
    PurchaseAmount: el.Units,
    UnitType: t(el.GoodUnit),
    Price: Number(sdk.appPowerRental(el.AppGoodID)?.UnitPrice),
    PaymentCurrency: el.PaymentBalances.length ? el.PaymentBalances?.[0]?.CoinUnit : constant.PriceCoinName,
    TotalCost: Number(el.PaymentAmountUSD).toString(),
    MiningPeriod: el.Durations,
    CumulativeProfit: detail.miningRewardFloat(undefined, logined.loginedUserID, el.PaymentBalances?.[0]?.CoinTypeID, el.OrderID) / getDeservedRatio.value(el.AppGoodID),
    ProfitCurrency: sdk.appPowerRental(el.AppGoodID)?.CoinUnit,
    OrderStatus: (sdk.orderState(el.OrderID)?.startsWith('MSG') ? t(sdk.orderState(el.OrderID)) : t('MSG_AWAITING_CONFIRMATION')) +
                (orderType ? '(' + orderType + ')' : '')
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

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), output], { type: 'text/plain;charset=utf-8' })
  const filename = t('MSG_ORDER_HISTORY') + '-' + utils.formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

</script>

<style lang='sass' scoped>
.last
  margin-right: 0
</style>
