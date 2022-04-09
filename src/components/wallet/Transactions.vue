<template>
  <ShowSwitchTable
    label='MSG_TRANSACTIONS'
    :rows='(transactions as Array<never>)'
    :table='(table as never)'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, useCoinStore, useTransactionStore, Transaction, formatTime } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

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
      transaction.Transactions.push({
        ID: 'AAAAAAAAAAAAAAAAAAAA',
        CoinTypeID: '2bf1c8b3-1839-4fb5-87b3-834d60fb9b2d',
        CreateAt: 0,
        FromAddressID: 'AAAAAAAAAAAAAAAAAAAAAAAAA',
        ToAddressID: 'BBBBBBBBBBBBBBBBBBBBB',
        Amount: 100000000000,
        State: 'done',
        Message: 'AAAAAAAAAAAAAAAAA',
        AppID: 'AAAAAAAAAAAAAAAA',
        UserID: 'BBBBBBBBBBBBBBBBBBBBB',
        ChainTransactionID: 'BBBBBBBBBBBBBBBBBBB'
      })
    })
  }
})

</script>

<stype lang='sass' scoped>
</stype>
