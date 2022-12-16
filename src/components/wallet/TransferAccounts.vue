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
    <template #top>
      <div class='warning waring-gap'>
        <img src='font-awesome/warning.svg'>
        <span v-html='$t("MSG_INTERNAL_TRANSFER_ADDRESS_WARNING")' />
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
  <q-dialog
    v-model='showing'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='product-container content-glass'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_DELETE_TRANSFER_ACCOUNTS') }}</h3>
            <p v-html='$t("MSG_DELETE_TRANSFER_ACCOUNTS_CAPTION")' />
            <!-- <div class='full-section'>
              <h4>{{ $t('MSG_DELETE_LABEL') }}:</h4>
              <span class='number'>{{ target.AppID }}</span>
            </div> -->
            <div class='full-section'>
              <!-- <h4>{{ $t('MSG_WITHDRAW_ADDRESS') }}:</h4> -->
              <span class='wallet-type'>{{ target.TargetEmailAddress.length > 0 ? target.TargetEmailAddress : target.TargetPhoneNO }}</span><br>
              <!-- <img class='copy-button' src='font-awesome/copy.svg'> -->
            </div>

            <button class='alt' @click='onCancelClick'>
              {{ $t('MSG_CANCEL1') }}
            </button>
            <button @click='onDeleteClick'>
              {{ $t('MSG_DELETE_ACCOUNT') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref } from 'vue'
import { NotifyType, TransferAccount, useBaseUserStore, useFrontendTransferAccountStore } from 'npool-cli-v4'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

const baseuser = useBaseUserStore()

const transferAccount = useFrontendTransferAccountStore()
const transfers = computed(() => transferAccount.TransferAccounts.TransferAccounts)

const showing = ref(false)
const target = ref({} as TransferAccount)

const onDeleteTransferAddressClick = (row: TransferAccount) => {
  target.value = { ...row }
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as TransferAccount
}

const onCancelClick = () => {
  onMenuHide()
}

const onDeleteClick = () => {
  transferAccount.deleteTransfer({
    TransferID: target.value.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_TRANSFER_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    onMenuHide()
  })
}

const router = useRouter()
const onAddNewAddressClick = () => {
  void router.push({ path: '/add/transferaccount' })
}

const table = computed(() => [
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
