<template>
  <ShowSwitchTable
    label='MSG_WITHDRAWS'
    :rows='(withdraws as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='Name' :props='myProps'>
          <LogoName
            :logo='myProps.row.CoinLogo'
            :name='myProps.row.CoinName'
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
          {{ myProps.row.AddressLabels?.join(',') }} ({{ myProps.row.Address }})
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { formatTime, NotifyType, useFrontendWithdrawStore, Withdraw, WithdrawState } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

const withdraw = useFrontendWithdrawStore()
const withdraws = computed(() => withdraw.withdraws)

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

onMounted(() => {
  if (withdraws.value.length === 0) {
    getWithdraws(0, 100)
  }
})

const getWithdraws = (offset: number, limit: number) => {
  withdraw.getWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Withdraw>) => {
    if (error || rows.length < limit) {
      return
    }
    getWithdraws(limit + offset, limit)
  })
}

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
    name: 'Status',
    label: t('MSG_STATUS'),
    align: 'center',
    field: 'State'
  },
  {
    name: 'Address',
    label: t('MSG_WITHDRAW_ADDRESS'),
    align: 'center',
    field: (row: Withdraw) => row.Address
  }
])
</script>

<style lang='sass' scoped>
</style>
