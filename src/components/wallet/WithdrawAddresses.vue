<template>
  <div :class='[ deleting ? "blur" : "" ]'>
    <ShowSwitchTable
      label='MSG_APPROVED_ADDRESSES'
      :rows='(accounts as Array<never>)'
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
      <template #top>
        <div class='warning waring-gap'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t("MSG_EXTERNAL_TRANSFER_ADDRESS_WARNING")' />
        </div>
      </template>
      <template #table-body='myProps'>
        <q-tr :props='myProps'>
          <q-td key='Blockchain' :props='myProps'>
            <LogoName
              :logo='myProps.row?.CoinLogo'
              :name='coinName(myProps.row?.CoinTypeID)'
            />
          </q-td>
          <q-td key='Address' :props='myProps'>
            {{ myProps.row?.Address }}
          </q-td>
          <q-td key='Label' :props='myProps'>
            {{ myProps.row.Labels?.join(',') }}
          </q-td>
          <q-td key='DateAdded' :props='myProps'>
            {{ formatTime(myProps.row?.CreatedAt) }}
          </q-td>
          <q-td key='ActionButtons' :props='myProps'>
            <button class='small' @click='onRemove(myProps.row)' :disabled='!deletable(myProps.row)'>
              {{ $t('MSG_REMOVE') }}
            </button>
          </q-td>
        </q-tr>
      </template>
    </ShowSwitchTable>
  </div>
  <q-dialog
    v-model='deleting'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='product-container content-glass'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_DELETE_WITHDRAW_ADDRESS') }}</h3>
            <p v-html='$t("MSG_DELETE_WITHDRAW_ADDRESS_CAPTION")' />

            <div class='full-section'>
              <h4>{{ $t('MSG_DELETE_LABEL') }}:</h4>
              <span class='number'>{{ deleteLabels }}</span>
            </div>

            <div class='full-section'>
              <h4>{{ $t('MSG_WITHDRAW_ADDRESS') }}:</h4>
              <span class='wallet-type'>{{ deleteCoinType }}</span><br>
              <span class='number'>{{ deleteAddress }}</span>
              <img class='copy-button' src='font-awesome/copy.svg' @click='onCopyAddressClick'>
            </div>

            <button class='alt' @click='onCancelClick'>
              {{ $t('MSG_CANCEL1') }}
            </button>
            <button @click='onDeleteClick'>
              {{ $t('MSG_DELETE_ADDRESS') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent, ref } from 'vue'
import { NotificationType, useNotificationStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import copy from 'copy-to-clipboard'
import { useLocalTransactionStore } from 'src/teststore/mock/transaction'
import { WithdrawState } from 'src/teststore/mock/transaction/const'
import { useLocalCoinStore } from 'src/localstore/coin'
import { NotifyType, formatTime, useFrontendUserAccountStore, Account, useAdminAppCoinStore } from 'npool-cli-v4'
import { getCoins } from 'src/api/coin'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useAdminAppCoinStore()
const account = useFrontendUserAccountStore()
const accounts = computed(() => account.withdrawAddress)

const trans = useLocalTransactionStore()
const withdraws = computed(() => trans.withdraws)

const localcoin = useLocalCoinStore()
const coinName = computed(() => (ID: string) => localcoin.formatCoinName(ID))

const deletable = (row: Account) => {
  return withdraws.value.filter((el) => {
    return el.State === WithdrawState.Reviewing || el.State === WithdrawState.Transferring
  }).findIndex((el) => el.Address === row.Address) < 0
}

const table = computed(() => [
  {
    name: 'Blockchain',
    label: t('MSG_BLOCKCHAIN'),
    align: 'left',
    field: (row: Account) => row.CoinName
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    align: 'center',
    field: (row: Account) => row.Address
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    align: 'center',
    field: (row: Account) => row.Labels?.join(',')
  },
  {
    name: 'DateAdded',
    label: t('MSG_DATE_ADDED'),
    align: 'center',
    field: (row: Account) => formatTime(row.CreatedAt)
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center',
    field: ''
  }
])

const router = useRouter()

const onAddNewAddressClick = () => {
  void router.push({ path: '/add/address' })
}

const deleteAccount = ref({} as Account)
const deleting = ref(false)

const onRemove = (row: Account) => {
  deleting.value = true
  deleteAccount.value = { ...row }
}

const onDeleteClick = () => {
  if (!deleteAccount.value) {
    return
  }

  account.deleteUserAccount({
    ID: deleteAccount.value.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_WITHDRAW_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    onMenuHide()
  })
}

const onCancelClick = () => {
  onMenuHide()
}

const deleteLabels = computed(() => deleteAccount.value.Labels?.join(','))
const deleteCoinType = computed(() => {
  const dcoin = coin.getCoinByID(deleteAccount.value?.CoinTypeID)
  if (!dcoin) {
    return ''
  }
  return dcoin.Name
})

const notification = useNotificationStore()

const deleteAddress = computed(() => deleteAccount.value?.Address)
const onCopyAddressClick = () => {
  copy(deleteAddress.value)
  notification.Notifications.push({
    Title: t('MSG_ADDRESS_COPIED'),
    Message: t('MSG_COPY_ADDRESS_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
  })
}

const onMenuHide = () => {
  deleting.value = false
  deleteAccount.value = {} as Account
}

onMounted(() => {
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
})

</script>

<style lang='sass' scoped>
</style>
