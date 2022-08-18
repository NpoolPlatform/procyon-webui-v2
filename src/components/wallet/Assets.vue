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
            :name='currencies.formatCoinName(myProps.row.CoinName)'
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
          <button class='small' @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Balance <= 0.0001 || submitting'>
            {{ $t('MSG_WITHDRAW') }}
          </button>
          <span class='btn-gap' />
          <WaitingBtn
            label='MSG_DEPOSIT'
            type='button'
            class='small'
            :disabled='beforeDepositLoading'
            :waiting='beforeDepositLoading'
            @click='onDepositClick(myProps.row)'
          />
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

          <div class='qr-code-container'>
            <h5>{{ ant.CoinName }} {{ $t('MSG_DEPOSIT_ADDRESS') }}</h5>
            <img :src='lineQr'>
          </div>

          <div class='hr' />

          <div class='full-section'>
            <h4>{{ $t('MSG_YOUR_ADDRESS') }}</h4>
            <div class='wallet-type'>
              {{ ant.CoinName }}
            </div>
            <span class='number'>{{ ant.Address }}</span>
            <img class='copy-button' src='font-awesome/copy.svg' @click='onCopyDepositAddress'>
          </div>

          <div class='hr' />

          <div class='warning'>
            <img src='font-awesome/warning.svg'>
            <span>{{ $t('MSG_DEPOSIT_REMINDER') }}</span>
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
  useCurrencyStore,
  BenefitModel,
  useKYCStore,
  ReviewState,
  useAccountStore,
  useNotificationStore,
  NotificationType
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BalanceGeneral, useLocalLedgerStore } from 'src/localstore/ledger'
import { Account, useLocalAccountStore } from 'src/teststore/mock/account'
import lineQr from '../../assets/line-qr.png'
import copy from 'copy-to-clipboard'

const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const currencies = useCurrencyStore()
const kyc = useKYCStore()
const localledger = useLocalLedgerStore()
const submitting = ref(false)

const balanceGenerals = computed(() => localledger.generals)

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

const ant = ref({} as Account)
const beforeDepositLoading = ref(false)
const showDepositing = ref(false)
const laccount = useLocalAccountStore()
const onDepositClick = (row: BalanceGeneral) => {
  beforeDepositLoading.value = true
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
    if (error || act === undefined) {
      beforeDepositLoading.value = false
      return
    }
    beforeDepositLoading.value = false
    showDepositDialog(act)
  })
}
const onReturnWallet = () => {
  hideDepositDialog()
}
const showDepositDialog = (act: Account) => {
  ant.value = act
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

<stype lang='sass' scoped>
.btn-gap
  margin-right: 9px
</stype>
