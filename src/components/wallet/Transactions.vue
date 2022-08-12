<template>
  <ShowSwitchTable
    label='MSG_TRANSACTIONS'
    :rows='(transactions as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='CoinName' :props='myProps'>
          <LogoName
            :logo='coin.getCoinByID(myProps.row.CoinTypeID)?.Logo'
            :name='currency.formatCoinName(myProps.row.CoinName as string)'
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
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, useCoinStore, formatTime, useCurrencyStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { Detail, IOType, IOSubType, useLocalTransactionStore } from 'src/teststore/mock/transaction'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const localtrans = useLocalTransactionStore()
const currency = useCurrencyStore()
const transactions = computed(() => localtrans.details)

const transactionType = (tx: Detail) => {
  switch (tx.IOType) {
    case IOType.Incoming:
      switch (tx.IOSubType) {
        case IOSubType.Payment:
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
  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>

<stype lang='sass' scoped>
</stype>
