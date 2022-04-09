<template>
  <ShowSwitchTable
    label='MSG_TRANSACTIONS'
    :rows='(transactions as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='Name' :props='myProps'>
          <LogoName
            :logo='coin.getCoinByID(myProps.row.CoinTypeID)?.Logo'
            :name='coin.getCoinByID(myProps.row.CoinTypeID)?.Name'
          />
        </q-td>
        <q-td key='Date' :props='myProps'>
          {{ formatTime(myProps.row.CreateAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ myProps.row.Amount }}
        </q-td>
        <q-td key='Status' :props='myProps'>
          {{ myProps.row.State }}
        </q-td>
        <q-td key='Type' :props='myProps'>
          Withdrawal
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, useCoinStore, useTransactionStore, Transaction, formatTime } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const transaction = useTransactionStore()
const transactions = computed(() => transaction.Transactions)

const table = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: (row: Transaction) => coin.getCoinByID(row.CoinTypeID)?.Name
  },
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'center',
    field: (row: Transaction) => formatTime(row.CreateAt)
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    align: 'center',
    field: 'Amount'
  },
  {
    name: 'Status',
    label: t('MSG_STATUS'),
    align: 'center',
    field: 'State'
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    align: 'center',
    field: () => 'Withdrawal'
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

  if (transactions.value.length === 0) {
    transaction.getTransactions({
      Message: {
        Error: {
          Title: t('MSG_GET_TRANSACTIONS_FAIL'),
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
