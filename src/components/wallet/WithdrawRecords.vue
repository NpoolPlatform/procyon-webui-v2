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
            :name='withdrawLabel(myProps.row)'
          />
        </q-td>
        <q-td key='Date' :props='myProps'>
          {{ utils.formatTime(myProps.row.CreatedAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ utils.getLocaleString(myProps.row.Amount) }}{{ myProps.row.CoinUnit }}
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
import { utils, notify, ledgerwithdraw, user } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

const logined = user.useLocalUserStore()
const withdraw = ledgerwithdraw.useWithdrawStore()
const withdraws = computed(() => withdraw.withdraws(undefined, logined.loginedUserID))

const withdrawLabel = (w: ledgerwithdraw.Withdraw) => {
  let label = w.CoinName
  if (w.DisplayNames?.length > 2 && w.DisplayNames[2]?.length > 0) {
    label = w.DisplayNames[2]
  }
  return label
}

const withdrawStatus = (wd: ledgerwithdraw.Withdraw) => {
  switch (wd.State) {
    case ledgerwithdraw.WithdrawState.Reviewing:
      return 'MSG_UNDER_REVIEW'
    case ledgerwithdraw.WithdrawState.Transferring:
      return 'MSG_IN_PROGRESS'
    case ledgerwithdraw.WithdrawState.Rejected:
      return 'MSG_FAILED'
    case ledgerwithdraw.WithdrawState.TransactionFail:
      return 'MSG_FAILED'
    case ledgerwithdraw.WithdrawState.Successful:
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
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ledgerwithdraw.Withdraw>) => {
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
    field: (row: ledgerwithdraw.Withdraw) => row.CoinName
  },
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'center',
    field: (row: ledgerwithdraw.Withdraw) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'Amount',
    label: t('MSG_TRANSACTION_AMOUNT'),
    align: 'center',
    field: (row: ledgerwithdraw.Withdraw) => row.Amount + row.CoinUnit
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
    field: (row: ledgerwithdraw.Withdraw) => row.Address
  }
])
</script>

<style lang='sass' scoped>
</style>
