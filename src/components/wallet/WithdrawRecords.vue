<template>
  <ShowSwitchTable
    label='MSG_WITHDRAWS'
    :rows='(withdraws.Withdraws as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='Name' :props='myProps'>
          <LogoName
            :logo='myProps.row.CoinLogo'
            :name='currency.formatCoinName(myProps.row.CoinName)'
          />
        </q-td>
        <q-td key='Date' :props='myProps'>
          {{ formatTime(myProps.row.CreatedAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ myProps.row.Amount }}{{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='Status' :props='myProps'>
          {{ $t(withdrawStatus(myProps.row)) }}
        </q-td>
        <q-td key='Address' :props='myProps'>
          {{ myProps.row.AddressLabels }} ({{ myProps.row.Address }})
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { formatTime, useCurrencyStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useLocalTransactionStore, Withdraw } from 'src/teststore/mock/transaction'
import { WithdrawState } from 'src/teststore/mock/transaction/const'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const locationTrans = useLocalTransactionStore()
const currency = useCurrencyStore()
const withdraws = computed(() => locationTrans.Withdraws)

const table = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: Withdraw) => row.CoinName
  },
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'center',
    field: (row: Withdraw) => formatTime(row.CreatedAt)
  },
  {
    name: 'Amount',
    label: t('MSG_TRANSACTION_AMOUNT'),
    align: 'center',
    field: (row: Withdraw) => row.Amount + row.CoinUnit
  },
  {
    name: 'Address',
    label: t('MSG_WITHDRAW_ADDRESS'),
    align: 'center',
    field: (row: Withdraw) => row.Address
  },
  {
    name: 'Status',
    label: t('MSG_STATUS'),
    align: 'center',
    field: 'State'
  }
])

const withdrawStatus = (wd: Withdraw) => {
  switch (wd.State) {
    case WithdrawState.Reviewing:
      return 'MSG_UNDER_REVIEW'
    case WithdrawState.Transferring:
      return 'MSG_IN_PROGRESS'
    case WithdrawState.Rejected:
      return 'MSG_FAILED'
    case WithdrawState.TransactionFail:
      return 'MSG_FAILED'
    case WithdrawState.Successful:
      return 'MSG_COMPLETED'
    default:
      return 'MSG_UNKNOWN'
  }
}
</script>

<stype lang='sass' scoped>
</stype>
