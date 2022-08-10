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
          {{ myProps.row.Amount }}
        </q-td>
        <q-td key='Status' :props='myProps'>
          {{ myProps.row.State }}
        </q-td>
        <q-td key='IOType' :props='myProps'>
          {{ myProps.row.IOType }}
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, useCoinStore, formatTime, useCurrencyStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { Detail, useLocalTransactionStore } from 'src/teststore/mock/transaction'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const localtrans = useLocalTransactionStore()
const currency = useCurrencyStore()
const transactions = computed(() => localtrans.Details.Details)

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
    name: 'Status',
    label: t('MSG_STATUS'),
    align: 'center',
    field: 'State'
  },
  {
    name: 'IOType',
    label: t('MSG_TYPE'),
    align: 'center',
    field: () => 'IOType'
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
