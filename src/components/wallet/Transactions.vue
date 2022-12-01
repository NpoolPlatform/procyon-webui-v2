<template>
  <UseCoin />
  <ShowSwitchTable
    label='MSG_TRANSACTIONS'
    :rows='(details as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='CoinName' :props='myProps'>
          <LogoName
            :logo='myProps.row.CoinLogo'
            :name='myProps.row.CoinName'
          />
        </q-td>
        <q-td key='CreatedAt' :props='myProps'>
          {{ formatTime(myProps.row.CreatedAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ transactionSign(myProps.row) }} {{ myProps.row.Amount }} {{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='IOType' :props='myProps'>
          {{ $t(transactionType(myProps.row)) }}
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Detail, IOType, IOSubType } from 'src/teststore/mock/transaction'
import { formatTime, NotifyType, useFrontendDetailStore } from 'npool-cli-v4'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const UseCoin = defineAsyncComponent(() => import('src/components/coin/UseCoin.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const detail = useFrontendDetailStore()
const details = computed(() => detail.Details.Details)

const transactionType = (tx: Detail) => {
  switch (tx.IOType) {
    case IOType.Incoming:
      switch (tx.IOSubType) {
        case IOSubType.Payment:
          return 'MSG_DEPOSIT'
        case IOSubType.Transfer:
          return 'MSG_DEPOSIT'
        case IOSubType.MiningBenefit:
          return 'MSG_MINING_REWARD'
        case IOSubType.Commission:
          return 'MSG_COMMISSION'
        case IOSubType.TechniqueFeeCommission:
          return 'MSG_TECHNIQUE_FEE_COMMISSION'
        case IOSubType.Deposit:
          return 'MSG_DEPOSIT'
        default:
          return 'MSG_UNKNOWN'
      }
    case IOType.Outcoming:
      switch (tx.IOSubType) {
        case IOSubType.Payment:
          return 'MSG_ORDER_PAYMENT'
        case IOSubType.Withdrawal:
          return 'MSG_WITHDRAWAL'
        case IOSubType.Transfer:
          return 'MSG_WITHDRAWAL'
        default:
          return 'MSG_UNKNOWN'
      }
    default:
      return 'MSG_UNKNOWN'
  }
}

const transactionSign = (tx: Detail) => {
  switch (tx.IOType) {
    case IOType.Incoming:
      return '+'
    case IOType.Outcoming:
      return '-'
    default:
      return '*'
  }
}

const table = computed(() => [
  {
    name: 'CoinName',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: Detail) => row.CoinName
  },
  {
    name: 'CreatedAt',
    label: t('MSG_DATE'),
    align: 'center',
    field: (row: Detail) => formatTime(row.CreatedAt)
  },
  {
    name: 'Amount',
    label: t('MSG_TRANSACTION_AMOUNT'),
    align: 'center',
    field: 'Amount'
  },
  {
    name: 'IOType',
    label: t('MSG_TYPE'),
    align: 'center',
    field: () => (row: Detail) => transactionType(row)
  }
])

onMounted(() => {
  if (details.value.length === 0) {
    getDetails(0, 100)
  }
})

const getDetails = (offset: number, limit: number) => {
  detail.getDetails({
    Offset: offset,
    Limit: limit,
    EndAt: Math.ceil(Date.now() / 1000),
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Detail>) => {
    if (error || rows.length < limit) {
      return
    }
    getDetails(limit + offset, limit)
  })
}
</script>

<style lang='sass' scoped>
</style>
