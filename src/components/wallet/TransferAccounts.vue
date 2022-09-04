<template>
  <ShowSwitchTable
    label='MSG_TRANSFER_ACCOUNTS'
    :rows='(transfers as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #top-right>
      <div class='buttons'>
        <button @click='onAddNewAddressClick'>
          {{ $t('MSG_ADD_TRANSFER_ACCOUNT') }}
        </button>
      </div>
    </template>
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='TargetUsername' :props='myProps'>
          {{ baseuser.displayName1(myProps.row.TargetEmailAddress, myProps.row.TargetPhoneNO, myProps.row.TargetFirstName, myProps.row.TargetLastName, locale as string) }}
        </q-td>
        <q-td key='TargetEmailAddress' :props='myProps'>
          {{ myProps.row.TargetEmailAddress }}
        </q-td>
        <q-td key='TargetPhoneNO' :props='myProps'>
          {{ myProps.row.TargetPhoneNO }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onDeleteTransferAddressClick(myProps.row)'>
            {{ $t('MSG_DELETE_ACCOUNT') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, TransferAccount, useBaseUserStore, useFrontendTransferAccountStore } from 'npool-cli-v4'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const transfers = computed(() => transferAccount.TransferAccounts.TransferAccounts)

const transferAccount = useFrontendTransferAccountStore()
const baseuser = useBaseUserStore()

const getTransferAccounts = (offset: number, limit: number) => {
  transferAccount.getTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_TRANSFER_ACCOUNTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (transfers: Array<TransferAccount>, error: boolean) => {
    if (error || transfers.length < limit) {
      return
    }
    getTransferAccounts(limit + offset, limit)
  })
}
onMounted(() => {
  if (transferAccount.TransferAccounts.TransferAccounts.length === 0) {
    getTransferAccounts(0, 500)
  }
})

const router = useRouter()
const onAddNewAddressClick = () => {
  void router.push({ path: '/add/transferaccount' })
}

const onDeleteTransferAddressClick = (row: TransferAccount) => {
  transferAccount.deleteTransfer({
    TransferID: row.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_TRANSFER_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
const table = computed(() => [
  /*
  {
    name: 'TargetUserID',
    label: t('MSG_TARGET_USERID'),
    align: 'left',
    field: (row: TransferAccount) => row.TargetUserID
  },
  */
  {
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    align: 'left',
    field: (row: TransferAccount) => baseuser.displayName1(row.TargetEmailAddress, row.TargetPhoneNO, row.TargetFirstName, row.TargetLastName, locale.value as string)
  },
  {
    name: 'TargetEmailAddress',
    label: t('MSG_TARGET_EMAIL_ADDRESS'),
    align: 'center',
    field: (row: TransferAccount) => row.TargetEmailAddress
  },
  {
    name: 'TargetPhoneNO',
    label: t('MSG_TARGET_PHONENO'),
    align: 'center',
    field: (row: TransferAccount) => row.TargetPhoneNO
  },
  {
    name: 'ActionButtons',
    align: 'center'
  }
])
</script>

<style lang='sass' scoped>
  .btn-gap
    margin-right: 9px
</style>
