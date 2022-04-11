<template>
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
            :name='coin.getCoinByID(myProps.row.Address.CoinTypeID)?.Name'
          />
        </q-td>
        <q-td key='Address' :props='myProps'>
          {{ myProps.row.Account.Address }}
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
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, useCoinStore, WithdrawAccount, formatTime, useAccountStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const account = useAccountStore()
const accounts = computed(() => account.Accounts)

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

const onRemove = (address: WithdrawAccount) => {
  account.deleteWithdrawAddress({
    ID: address.Address.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_WITHDRAW_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

</script>

<stype lang='sass' scoped>
</stype>
