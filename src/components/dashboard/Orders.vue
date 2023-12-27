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
import { utils, order, appgood, ledgerstatement, goodbase, user, constant } from 'src/npoolstore'
import { stringify } from 'csv-stringify/sync'
import saveAs from 'file-saver'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = user.useLocalUserStore()

const _order = order.useOrderStore()
const orders = computed(() => _order.orders(undefined, logined.loginedUserID))

const detail = ledgerstatement.useStatementStore()

const good = appgood.useAppGoodStore()
const getDeservedRatio = computed(() => (appGoodID: string) => 1 - Number(good.techniqueFeeTatio(undefined, appGoodID)) / 100)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: order.Order) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'Product',
    label: t('MSG_PRODUCT'),
    align: 'center',
    field: (row: order.Order) => good.displayNames(undefined, row.AppGoodID).length >= 4 ? t(good.displayNames(undefined, row.AppGoodID)[3]) : row.GoodName
  },
  {
    name: 'Total',
    label: t('MSG_PURCHASE_AMOUNT'),
    align: 'center',
    field: (row: order.Order) => `${utils.getLocaleString(parseFloat(row.Units))} ${t(row.GoodUnit)}`
  },
  {
    name: 'Price',
    label: t('MSG_PRICE'),
    align: 'center',
    field: (row: order.Order) => utils.getLocaleString(Number(row.GoodValueUSD)) + ' ' + constant.PriceCoinName
  },
  {
    name: 'Period',
    label: t('MSG_PERIOD'),
    align: 'center',
    field: (row: order.Order) => utils.getLocaleString(row.GoodServicePeriodDays) + t('MSG_DAY')
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    align: 'center',
    field: (row: order.Order) => {
      let orderType = undefined as unknown as order.OrderType
      if (row.OrderType === order.OrderType.Offline) {
        orderType = order.OrderType.Offline
      } else if (row.OrderType === order.OrderType.Airdrop) {
        orderType = order.OrderType.Airdrop
      }
      return (_order.orderState(row.ID)?.startsWith('MSG') ? t(_order.orderState(row.ID)) : t('MSG_AWAITING_CONFIRMATION')) +
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
  const _good = good.good(undefined, appGoodID)
  return _good?.GoodType === goodbase.GoodType.PowerRenting || _good?.GoodType === goodbase.GoodType.MachineHosting ? 'Mining' : _good?.GoodType
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
    ProductName: good.displayNames(undefined, el.AppGoodID)?.[3] ? t(good.displayNames(undefined, el.AppGoodID)?.[3]) : el.GoodName,
    PurchaseAmount: el.Units,
    UnitType: t(el.GoodUnit),
    Price: good.packagePriceFloat(undefined, el.AppGoodID),
    PaymentCurrency: el.PaymentCoinUnit.length ? el.PaymentCoinUnit : constant.PriceCoinName,
    TotalCost: Number(el.PaymentAmount).toString(),
    MiningPeriod: el.GoodServicePeriodDays,
    CumulativeProfit: detail.miningRewardFloat(undefined, logined.loginedUserID, el.CoinTypeID, el.EntID) / getDeservedRatio.value(el.AppGoodID),
    ProfitCurrency: good.good(undefined, el.AppGoodID)?.CoinUnit,
    OrderStatus: (_order.orderState(el.ID)?.startsWith('MSG') ? t(_order.orderState(el.ID)) : t('MSG_AWAITING_CONFIRMATION')) +
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
