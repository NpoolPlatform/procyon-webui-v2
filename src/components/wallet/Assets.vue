<template>
  <ShowSwitchTable
    label='MSG_ASSETS'
    :rows='(balanceGenerals as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='CoinName' :props='myProps'>
          <LogoName
            :logo='myProps.row.CoinLogo'
            :name='coinName(myProps.row.CoinTypeID)'
          />
        </q-td>
        <q-td key='Balance' :props='myProps'>
          {{ myProps.row.Balance.toFixed(4) }}{{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='Last24HoursBalance' :props='myProps'>
          {{ myProps.row.Last24HoursBalance.toFixed(4) }}{{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='USDTValue' :props='myProps'>
          {{ myProps.row.USDValue.toFixed(4) }}
        </q-td>
        <q-td key='JPYValue' :props='myProps'>
          {{ myProps.row.JPYValue.toFixed(4) }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Balance <= 0.0001 || submitting || depositClick'>
            {{ $t('MSG_WITHDRAW') }}
          </button>
          <span class='btn-gap' />
          <button class='small' @click='onDepositClick(myProps.row)' :disabled='!payCoin(myProps.row.CoinTypeID) || depositClick'>
            {{ $t('MSG_DEPOSIT') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
  <q-dialog
    v-model='showDepositing'
    maximized
    @hide='hideDepositDialog'
  >
    <div class='popup product-container'>
      <div class='form-container content-glass'>
        <div class='confirmation'>
          <h3>{{ $t('MSG_DEPOSIT_ADDRESS') }}</h3>

          <div class='qr-code-container' ref='qrCodeContainer'>
            <h5>{{ coinName(ant?.CoinTypeID) }} {{ $t('MSG_DEPOSIT_ADDRESS') }}</h5>
            <qrcode-vue
              :value='ant?.Address'
              :size='qrCodeContainer?.clientWidth as number - 1'
              :margin='3'
              class='qr-code'
            />
          </div>

          <div class='hr' />

          <div class='full-section'>
            <h4>{{ $t('MSG_YOUR_ADDRESS') }}</h4>
            <div class='wallet-type'>
              {{ coinName(ant.CoinTypeID) }}
            </div>
            <span class='number'>{{ ant.Address }}</span>
            <img class='copy-button' src='font-awesome/copy.svg' @click='onCopyDepositAddress'>
          </div>

          <div class='hr' />

          <div class='warning'>
            <img src='font-awesome/warning.svg'>
            <span v-html='$t("MSG_DEPOSIT_REMINDER")' />
          </div>

          <button @click='onReturnWallet'>
            {{ $t('MSG_RETURN_TO_WALLET') }}
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref } from 'vue'
import {
  BenefitModel,
  useKYCStore,
  ReviewState,
  useAccountStore,
  useNotificationStore,
  NotificationType,
  useCoinStore
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BalanceGeneral, useLocalLedgerStore } from 'src/localstore/ledger'
import { Account, useLocalAccountStore } from 'src/teststore/mock/account'
import copy from 'copy-to-clipboard'
import { useLocalCoinStore } from 'src/localstore/coin'
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const kyc = useKYCStore()
const localledger = useLocalLedgerStore()
const submitting = ref(false)

const balanceGenerals = computed(() => localledger.generals.filter((el) => !preSaleCoin(el.CoinTypeID) && !coinBlacklist(el.CoinTypeID)))

const table = computed(() => [
  {
    name: 'CoinName',
    label: t('MSG_NAME'),
    align: 'left',
    field: 'CoinName'
  },
  {
    name: 'Balance',
    label: t('MSG_BALANCE'),
    align: 'center',
    field: 'Balance'
  },
  {
    name: 'Last24HoursBalance',
    label: t('MSG_24_HOUR_CHANGE'),
    align: 'center',
    field: 'Last24HoursBalance'
  },
  {
    name: 'USDTValue',
    label: t('MSG_MARKET_VALUE_USDT'),
    align: 'center',
    field: 'USDTValue'
  },
  {
    name: 'JPYValue',
    label: t('MSG_MARKET_VALUE_JPY'),
    align: 'center',
    field: 'JPYValue'
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center'
  }
])

const router = useRouter()
const account = useAccountStore()
const accounts = computed(() => account.Accounts.filter((el) => el.State === ReviewState.Approved))

const onWithdrawClick = (asset: BenefitModel) => {
  submitting.value = true
  kyc.getKYC({
    Message: {
      /*
      Error: {
        Title: t('MSG_GET_KYCS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
      */
    }
  }, (error: boolean) => {
    submitting.value = false
    if (error) {
      void router.push({ path: '/kyc' })
      return
    }
    if (!kyc.KYC.Kyc || kyc.KYC.State !== ReviewState.Approved) {
      void router.push({ path: '/kyc' })
      return
    }

    const exist = accounts.value.find((account) => {
      return account.Account.CoinTypeID === asset.CoinTypeID && account.State === ReviewState.Approved
    })
    if (!exist) {
      void router.push({
        path: '/add/address',
        query: {
          coinTypeId: asset.CoinTypeID,
          gotoWithdraw: 'true'
        }
      })
      return
    }

    void router.push({
      path: '/withdraw',
      query: {
        coinTypeId: asset.CoinTypeID
      }
    })
  })
}
const laccount = useLocalAccountStore()

const coin = useCoinStore()
const payCoin = (coinTypeID: string) => {
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  return existingItem.ForPay
}
const preSaleCoin = (coinTypeID: string) => {
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  return existingItem.PreSale
}
const coinBlacklist = (coinTypeID: string) => {
  const names = ['Ethereum', 'Tron', 'Solana']
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  let flag = false
  names.forEach((el) => {
    if (existingItem.Name?.toLowerCase().includes(el.toLowerCase())) {
      flag = true
    }
  })
  return flag
}

const localcoin = useLocalCoinStore()
const coinName = computed(() => (ID: string) => localcoin.formatCoinName(ID))

const ant = ref({} as Account)
const showDepositing = ref(false)
const qrCodeContainer = ref<HTMLDivElement>()
const depositClick = ref(false)

const onDepositClick = (row: BalanceGeneral) => {
  depositClick.value = true
  laccount.getDepositAccount({
    CoinTypeID: row.CoinTypeID,
    Message: {
      Error: {
        Title: t('MSG_FAIL_TO_GET_DEPOSIT_ACCOUNT'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, act?: Account) => {
    depositClick.value = false

    if (error || act === undefined) {
      return
    }
    showDepositDialog(act)
  })
}
const onReturnWallet = () => {
  hideDepositDialog()
}
const showDepositDialog = (act: Account) => {
  ant.value = { ...act }
  showDepositing.value = true
}
const hideDepositDialog = () => {
  ant.value = {} as Account
  showDepositing.value = false
}

const notification = useNotificationStore()
function onCopyDepositAddress () {
  copy(ant.value.Address)
  notification.Notifications.push({
    Title: t('MSG_DEPOSIT_ADDRESS_COPIED'),
    Message: t('MSG_COPY_DEPOSIT_ADDRESS_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
  })
}
</script>

<style lang='sass' scoped>
.btn-gap
  margin-right: 9px
</style>
