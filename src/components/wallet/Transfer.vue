<template>
  <ShowSwitchTable
    label='MSG_TRANSFERS'
    :rows='(transfers as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
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
            {{ $t('MSG_WITHDRAW') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, Transfer, useFrontendTransferStore } from 'npool-cli-v4'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const transfers = computed(() => transfer.Transfers.Transfers)

const transfer = useFrontendTransferStore()

const getTransfers = (offset: number, limit: number) => {
  transfer.getTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (transfers: Array<Transfer>, error: boolean) => {
    if (error || transfers.length < limit) {
      return
    }
    getTransfers(limit + offset, limit)
  })
}
onMounted(() => {
  if (transfer.Transfers.Transfers.length === 0) {
    getTransfers(0, 500)
  }
})
const onTransferClick = (row: Transfer) => {
  // TODO
  console.log(row)
}

const table = computed(() => [
  {
    name: 'TargetUserID',
    label: t('MSG_TARGET_USERID'),
    align: 'left',
    field: (row: Transfer) => row.TargetUserID
  },
  {
    name: 'TargetEmailAddress',
    label: t('MSG_TARGET_EMAIL_ADDRESS'),
    align: 'center',
    field: (row: Transfer) => row.TargetEmailAddress
  },
  {
    name: 'TargetPhoneNO',
    label: t('MSG_TARGET_PHONENO'),
    align: 'center',
    field: (row: Transfer) => row.TargetPhoneNO
  },
  {
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    align: 'center',
    field: (row: Transfer) => row.TargetUsername
  }
])
</script>

<style lang='sass' scoped>
</style>
