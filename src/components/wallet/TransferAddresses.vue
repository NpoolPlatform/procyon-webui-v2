<template>
  <ShowSwitchTable
    label='MSG_TRANSFERS_ADDRESS'
    :rows='(transfers as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #top-right>
      <div class='buttons'>
        <button @click='onAddNewAddressClick'>
          {{ $t('MSG_ADD_NEW_ADDRESS') }}
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
            {{ $t('MSG_DELETE_ADDRESS') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, TransferAddress, useFrontendTransferAddressStore } from 'npool-cli-v4'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const transfers = computed(() => transferAddress.TransferAddress.TransferAddress)

const transferAddress = useFrontendTransferAddressStore()

const getTransferAddress = (offset: number, limit: number) => {
  transferAddress.getTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (transfers: Array<TransferAddress>, error: boolean) => {
    if (error || transfers.length < limit) {
      return
    }
    getTransferAddress(limit + offset, limit)
  })
}
onMounted(() => {
  if (transferAddress.TransferAddress.TransferAddress.length === 0) {
    getTransferAddress(0, 500)
  }
})
const onTransferClick = (row: TransferAddress) => {
  console.log(row)
}

const router = useRouter()
const onAddNewAddressClick = () => {
  void router.push({ path: '/add/transfer' })
}

const onDeleteTransferAddressClick = (row: TransferAddress) => {
  transferAddress.deleteTransfer({
    TransferID: row.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_TRANSFER_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (address: TransferAddress, error: boolean) => {
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
    field: (row: TransferAddress) => row.TargetUserID
  },
  {
    name: 'TargetEmailAddress',
    label: t('MSG_TARGET_EMAIL_ADDRESS'),
    align: 'center',
    field: (row: TransferAddress) => row.TargetEmailAddress
  },
  {
    name: 'TargetPhoneNO',
    label: t('MSG_TARGET_PHONENO'),
    align: 'center',
    field: (row: TransferAddress) => row.TargetPhoneNO
  },
  {
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    align: 'center',
    field: (row: TransferAddress) => row.TargetUsername
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
