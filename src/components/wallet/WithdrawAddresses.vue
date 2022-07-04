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
      <template #table-body='myProps'>
        <q-tr :props='myProps'>
          <q-td key='Blockchain' :props='myProps'>
            <LogoName
              :logo='coin.getCoinByID(myProps.row.Address.CoinTypeID)?.Logo'
              :name='currency.formatCoinName(coin.getCoinByID(myProps.row.Address.CoinTypeID)?.Name as string)'
            />
          </q-td>
          <q-td key='Address' :props='myProps'>
            {{ myProps.row.Account?.Address }}
          </q-td>
          <q-td key='Label' :props='myProps'>
            {{ myProps.row.Address.Labels?.join(',') }}
          </q-td>
          <q-td key='DateAdded' :props='myProps'>
            {{ formatTime(myProps.row.Address.CreateAt) }}
          </q-td>
          <q-td key='ActionButtons' :props='myProps'>
            <button class='small' @click='onRemove(myProps.row)'>
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
              <h4>{{ $t('MSG_DELETE_LABEL') }}</h4>
              <span class='number'>{{ deleteLabels }}</span>
            </div>

            <div class='full-section'>
              <h4>{{ $t('MSG_ADDRESS') }}</h4>
              <span class='wallet-type'>{{ deleteCoinType }}</span><br>
              <span class='number'>{{ deleteAddress }}</span>
              <img class='copy-button' src='font-awesome/copy.svg'>
            </div>

            <button class='alt' @click='onCancelClick'>
              {{ $t('MSG_CANCEL') }}
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
import { NotificationType, useCoinStore, WithdrawAccount, formatTime, useAccountStore, useCurrencyStore, ReviewState } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const currency = useCurrencyStore()
const account = useAccountStore()
const accounts = computed(() => account.Accounts.filter((el) => el.State === ReviewState.Approved))

const table = computed(() => [
  {
    name: 'Blockchain',
    label: t('MSG_BLOCKCHAIN'),
    align: 'left',
    field: (row: WithdrawAccount) => coin.getCoinByID(row.Address.CoinTypeID)?.Name
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    align: 'center',
    field: (row: WithdrawAccount) => row.Account.Address
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    align: 'center',
    field: (row: WithdrawAccount) => row.Address.Labels?.join(',')
  },
  {
    name: 'DateAdded',
    label: t('MSG_DATE_ADDED'),
    align: 'center',
    field: (row: WithdrawAccount) => formatTime(row.Address.CreateAt)
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center',
    field: ''
  }
])

onMounted(() => {
  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (accounts.value.length === 0) {
    account.getWithdrawAccounts({
      Message: {
        Error: {
          Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

const router = useRouter()

const onAddNewAddressClick = () => {
  void router.push({ path: '/add/address' })
}

const deleteAccount = ref(undefined as unknown as WithdrawAccount)
const deleting = ref(false)

const onRemove = (address: WithdrawAccount) => {
  deleting.value = true
  deleteAccount.value = address
}

const onDeleteClick = () => {
  onMenuHide()

  if (!deleteAccount.value) {
    return
  }

  account.deleteWithdrawAddress({
    ID: deleteAccount.value.Address.ID as string,
    Message: {
      Error: {
        Title: t('MSG_DELETE_WITHDRAW_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

const onCancelClick = () => {
  onMenuHide()
  deleteAccount.value = undefined as unknown as WithdrawAccount
}

const deleteLabels = computed(() => deleteAccount.value?.Address?.Labels?.join(','))
const deleteCoinType = computed(() => {
  const dcoin = coin.getCoinByID(deleteAccount.value?.Account?.CoinTypeID)
  if (!dcoin) {
    return ''
  }
  return dcoin.Name
})

const deleteAddress = computed(() => deleteAccount.value?.Account?.Address)

const onMenuHide = () => {
  deleting.value = false
}

</script>

<stype lang='sass' scoped>
</stype>
