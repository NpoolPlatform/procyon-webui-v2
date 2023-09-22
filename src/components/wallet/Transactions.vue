<template>
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
            :name='transactionLabel(myProps.row)'
          />
        </q-td>
        <q-td key='CreatedAt' :props='myProps'>
          {{ utils.formatTime(myProps.row.CreatedAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ transactionSign(myProps.row) }} {{ utils.getLocaleString(myProps.row.Amount) }} {{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='IOType' :props='myProps'>
          {{ $t(transactionType(myProps.row)) }}
        </q-td>
        <q-td key='TransactionID' :props='myProps'>
          <span v-if='myProps.row.IOSubType === ledgerstatement.IOSubType.Withdrawal'>
            {{ myProps.row.ShortTransactionID }}
            <img class='copy-button copy-btn' src='font-awesome/copy.svg' @click='onCopyTxIDClick(myProps.row)'>
          </span>
          <span v-else>
            {{ t('MSG_TXID_NA') }}
          </span>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ledgerstatement, utils, notify, user } from 'src/npoolstore'
import copy from 'copy-to-clipboard'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = user.useLocalUserStore()
const detail = ledgerstatement.useStatementStore()
const _details = computed(() => detail.statements(undefined, logined.loginedUserID))

interface IOExtra {
  WithdrawID: string
  TransactionID: string
  CID: string
  TransactionFee: string
  AccountID: string
}

interface MyStatement extends ledgerstatement.Statement {
  TransactionID: string
  ShortTransactionID: string
}

const notification = notify.useNotificationStore()
const onCopyTxIDClick = (row: MyStatement) => {
  copy(row?.TransactionID)
  notification.pushNotification({
    Title: 'MSG_TRANSACTION_ID_COPIED',
    Message: 'MSG_COPY_TRANSACTION_ID_SUCCESS',
    Popup: true,
    Type: notify.NotifyType.Success
  })
}

const details = computed(() => {
  const rows = [] as Array<MyStatement>
  _details.value?.forEach((el) => {
    let row = {} as MyStatement
    row = { ...el, ...{ TransactionID: '', ShortTransactionID: '' } }
    if (el.IOSubType === ledgerstatement.IOSubType.Withdrawal) {
      try {
        const extra = JSON.parse(el.IOExtra) as IOExtra
        row.TransactionID = extra.CID
        row = { ...el, ...{ TransactionID: extra.CID, ShortTransactionID: `${extra.CID?.substring(0, 8)}...${extra.CID?.substring(extra.CID.length - 6, extra.CID.length)}` } }
      } catch {
        // TODO
      }
    }
    rows.push(row)
  })
  return rows
})

const transactionLabel = (asset: ledgerstatement.Statement) => {
  let label = asset.CoinName
  if (asset.DisplayNames?.length > 2 && asset.DisplayNames?.[2]?.length > 0) {
    label = asset.DisplayNames?.[2]
  }
  return label
}

const transactionType = (tx: ledgerstatement.Statement) => {
  switch (tx.IOType) {
    case ledgerstatement.IOType.Incoming:
      switch (tx.IOSubType) {
        case ledgerstatement.IOSubType.Payment:
          return 'MSG_DEPOSIT'
        case ledgerstatement.IOSubType.Transfer:
          return 'MSG_DEPOSIT'
        case ledgerstatement.IOSubType.MiningBenefit:
          return 'MSG_MINING_REWARD'
        case ledgerstatement.IOSubType.Commission:
          return 'MSG_COMMISSION'
        case ledgerstatement.IOSubType.TechniqueFeeCommission:
          return 'MSG_TECHNIQUE_FEE_COMMISSION'
        case ledgerstatement.IOSubType.Deposit:
          return 'MSG_DEPOSIT'
        case ledgerstatement.IOSubType.OrderRevoke:
          return 'MSG_ORDER_REVOKE'
        default:
          return 'MSG_UNKNOWN'
      }
    case ledgerstatement.IOType.Outcoming:
      switch (tx.IOSubType) {
        case ledgerstatement.IOSubType.Payment:
          return 'MSG_ORDER_PAYMENT'
        case ledgerstatement.IOSubType.Withdrawal:
          return 'MSG_WITHDRAWAL'
        case ledgerstatement.IOSubType.Transfer:
          return 'MSG_WITHDRAWAL'
        case ledgerstatement.IOSubType.CommissionRevoke:
          return 'MSG_COMMISSION_REVOKE'
        default:
          return 'MSG_UNKNOWN'
      }
    default:
      return 'MSG_UNKNOWN'
  }
}

const transactionSign = (tx: ledgerstatement.Statement) => {
  switch (tx.IOType) {
    case ledgerstatement.IOType.Incoming:
      return '+'
    case ledgerstatement.IOType.Outcoming:
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
    field: (row: ledgerstatement.Statement) => row.CoinName
  },
  {
    name: 'CreatedAt',
    label: t('MSG_DATE'),
    align: 'center',
    field: (row: ledgerstatement.Statement) => utils.formatTime(row.CreatedAt)
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
    field: () => (row: ledgerstatement.Statement) => transactionType(row)
  },
  {
    name: 'TransactionID',
    label: t('MSG_TRANSACTION_ID'),
    align: 'center',
    field: () => (row: ledgerstatement.Statement) => transactionType(row)
  }
])

onMounted(() => {
  if (details.value.length === 0) {
    getDetails(0, 100)
  }
})

const getDetails = (offset: number, limit: number) => {
  detail.getStatements({
    Offset: offset,
    Limit: limit,
    EndAt: Math.ceil(Date.now() / 1000),
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAWS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ledgerstatement.Statement>) => {
    if (error || rows.length === 0) {
      return
    }
    getDetails(limit + offset, limit)
  })
}
</script>

<style lang='sass' scoped>
</style>
