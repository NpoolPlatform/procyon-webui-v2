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
        <q-td key='TargetUserID' :props='myProps'>
          {{ myProps.row.TargetUserID }}
        </q-td>
        <q-td key='TargetEmailAddress' :props='myProps'>
          {{ myProps.row.TargetEmailAddress }}
        </q-td>
        <q-td key='TargetPhoneNO' :props='myProps'>
          {{ myProps.row.TargetPhoneNO }}
        </q-td>
        <q-td key='TargetUsername' :props='myProps'>
          {{ myProps.row.TargetUsername }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onTransferClick(myProps.row)'>
            {{ $t('MSG_TRANSFER') }}
          </button>
          <span class='btn-gap' />
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
import { KYCState, NotifyType, TransferAccount, useFrontendKYCStore, useFrontendTransferAccountStore } from 'npool-cli-v4'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const transfers = computed(() => transferAccount.TransferAccounts.TransferAccounts)

const transferAccount = useFrontendTransferAccountStore()

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
const kyc = useFrontendKYCStore()
const onTransferClick = (row: TransferAccount) => {
  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    if (error) {
      void router.push({ path: '/kyc' })
      return
    }
    if (kyc.KYC?.State !== KYCState.Approved) {
      void router.push({ path: '/kyc' })
      return
    }

    void router.push({
      path: '/add/transfer',
      query: {
        transferID: row.ID
      }
    })
  })
}

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
  }, (address: TransferAccount, error: boolean) => {
    if (error) {
      return
    }
    console.log('address: ', address)
  })
}
const table = computed(() => [
  {
    name: 'TargetUserID',
    label: t('MSG_TARGET_USERID'),
    align: 'left',
    field: (row: TransferAccount) => row.TargetUserID
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
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    align: 'center',
    field: (row: TransferAccount) => row.TargetUsername
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
