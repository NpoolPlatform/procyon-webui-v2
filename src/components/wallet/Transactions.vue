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
          {{ formatTime(myProps.row.CreatedAt) }}
        </q-td>
        <q-td key='Amount' :props='myProps'>
          {{ transactionSign(myProps.row) }} {{ util.getLocaleString(myProps.row.Amount) }} {{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='IOType' :props='myProps'>
          {{ $t(transactionType(myProps.row)) }}
        </q-td>
        <q-td key='TransactionID' :props='myProps'>
          <span v-if='myProps.row.IOSubType === IOSubType.Withdrawal'>
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
import { Detail, formatTime, IOSubType, IOType, NotifyType, useFrontendDetailStore, useLocaleStringStore, useNotificationStore } from 'npool-cli-v4'
import copy from 'copy-to-clipboard'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const util = useLocaleStringStore()

const detail = useFrontendDetailStore()
const _details = computed(() => detail.details)

interface IOExtra {
  WithdrawID: string;
  TransactionID: string;
  CID: string;
  TransactionFee: string;
  AccountID: string;
}

interface MyDetail extends Detail {
  TransactionID: string;
  ShortTransactionID: string;
}

const notification = useNotificationStore()
const onCopyTxIDClick = (row: MyDetail) => {
  copy(row?.TransactionID)
  notification.Notifications.push({
    Title: t('MSG_TRANSACTION_ID_COPIED'),
    Message: t('MSG_COPY_TRANSACTION_ID_SUCCESS'),
    Popup: true,
    Type: NotifyType.Success
  })
}

const details = computed(() => {
  const rows = [] as Array<MyDetail>
  _details.value?.forEach((el) => {
    let row = {} as MyDetail
    row = { ...el, ...{ TransactionID: '', ShortTransactionID: '' } }
    if (el.IOSubType === IOSubType.Withdrawal) {
      const extra = JSON.parse(el.IOExtra) as IOExtra
      row.TransactionID = extra.CID
      row = { ...el, ...{ TransactionID: extra.CID, ShortTransactionID: `${row.TransactionID?.substring(0, 6)}...` } }
    }
    rows.push(row)
  })
  return rows
})

const transactionLabel = (asset: Detail) => {
  let label = asset.CoinName
  if (asset.DisplayNames?.length > 2 && asset.DisplayNames?.[2]?.length > 0) {
    label = asset.DisplayNames?.[2]
  }
  return label
}

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
        case IOSubType.OrderRevoke:
          return 'MSG_ORDER_REVOKE'
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
        case IOSubType.CommissionRevoke:
          return 'MSG_COMMISSION_REVOKE'
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
  },
  {
    name: 'TransactionID',
    label: t('MSG_TRANSACTION_ID'),
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
    if (error || rows.length === 0) {
      return
    }
    getDetails(limit + offset, limit)
  })
}
</script>

<style lang='sass' scoped>
</style>
