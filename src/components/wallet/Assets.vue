<template>
  <ShowSwitchTable
    label='MSG_ASSETS'
    :rows='(generals as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='CoinName' :props='myProps'>
          <LogoName
            :logo='myProps.row.CoinLogo'
            :name='assetLabel(myProps.row)'
          />
        </q-td>
        <q-td key='Balance' :props='myProps'>
          {{ utils.getLocaleString(myProps.row.Balance?.toFixed(4)) }} {{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='TotalUSDTValue' :props='myProps'>
          {{ !_coincurrency.currency(myProps.row.CoinTypeID) ? '-' : utils.getLocaleString(myProps.row.TotalUSDValue?.toFixed(4)) }}
        </q-td>
        <q-td key='TotalJPYValue' :props='myProps'>
          {{ !_coincurrency.currency(myProps.row.CoinTypeID) ? '-' : utils.getLocaleString(myProps.row.TotalJPYValue?.toFixed(4)) }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps' class='asset-button'>
          <button
            :class='["small", "alt", (myProps.row.Balance <= 0.0001 || submitting || depositClick || myProps.row.CoinDisabled) ? "in-active" : ""]'
            @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Balance <= 0.0001 || submitting || depositClick || myProps.row.CoinDisabled'
          >
            {{ $t('MSG_WITHDRAW') }}
          </button>
          <span class='btn-gap' />
          <button
            :class='["small", "alt", (!coin.forPay(undefined, myProps.row.CoinTypeID) || myProps.row.CoinDisabled || depositClick) ? "in-active" : ""]'
            @click='onDepositClick(myProps.row)' :disabled='!coin.forPay(undefined, myProps.row.CoinTypeID) || myProps.row.CoinDisabled || depositClick'
          >
            {{ $t('MSG_DEPOSIT') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
  <q-dialog
    v-model='showing'
    maximized
    @hide='onMenuHide'
  >
    <div class='popup product-container word-wrapper'>
      <div class='form-container content-glass'>
        <div class='confirmation'>
          <h3>{{ $t('MSG_DEPOSIT_ADDRESS') }}</h3>
          <div class='qr-code-container' ref='qrCodeContainer'>
            <h5>{{ depositAccount?.CoinDisplayNames?.length >= 3 ? depositAccount?.CoinDisplayNames[2] : depositAccount.CoinName }} {{ $t('MSG_DEPOSIT_ADDRESS') }}</h5>
            <qrcode-vue
              :value='depositAccount?.Address'
              :size='qrCodeContainer?.clientWidth as number - 1'
              :margin='3'
              class='qr-code'
            />
          </div>
          <div class='hr' />
          <div class='full-section'>
            <h4>{{ $t('MSG_YOUR_ADDRESS') }}</h4>
            <div class='wallet-type'>
              {{ depositAccount?.CoinDisplayNames?.length >= 3 ? depositAccount?.CoinDisplayNames[2] : depositAccount.CoinName }}
            </div>
            <span class='number word-wrapper'>{{ depositAccount?.Address }}</span>
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
import { useRouter } from 'vue-router'
import copy from 'copy-to-clipboard'
import { IntervalKey } from 'src/const/const'
import {
  appcoin,
  notify,
  coincurrency,
  ledger,
  kyc,
  fiatcurrency,
  user,
  useraccountbase,
  utils,
  ledgerprofit,
  sdk
} from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))

interface MyLedger extends ledger.Ledger {
  Balance: number
  Last24HoursBalance: number
  TotalUSDValue: number
  TotalJPYValue: number
}

const assetLabel = (asset: ledger.Ledger) => {
  let label = asset.CoinName
  if (asset.DisplayNames?.length > 2 && asset.DisplayNames?.[2]?.length > 0) {
    label = asset.DisplayNames?.[2]
  }
  return label
}

const router = useRouter()
const coin = appcoin.useAppCoinStore()
const _kyc = kyc.useKYCStore()
const _coincurrency = coincurrency.useCurrencyStore()
const _fiatcurrency = fiatcurrency.useFiatCurrencyStore()
const logined = user.useLocalUserStore()

const general = ledger.useLedgerStore()
const profit = ledgerprofit.useProfitStore()

const generals = computed(() => {
  return Array.from(general.ledgers(undefined, logined.loginedUserID).filter((el) => {
    return !coin.preSale(undefined, el.CoinTypeID) && el.CoinDisplay
  })).map((el) => {
    return {
      ...el,
      Balance: Number(el.Spendable),
      Last24HoursBalance: profit.intervalIncoming(undefined, logined.loginedUserID, el.CoinTypeID, IntervalKey.LastDay),
      TotalUSDValue: Number(el.Spendable) * _coincurrency.currency(el.CoinTypeID),
      TotalJPYValue: Number(el.Spendable) * _coincurrency.currency(el.CoinTypeID) * _fiatcurrency.jpy()
    } as MyLedger
  }).sort((a, b) => a.TotalUSDValue > b.TotalUSDValue ? -1 : 1)
})

const transferAccounts = computed(() => sdk.userTransferAccounts(undefined))
const depositAccount = ref({} as useraccountbase.Account)

const qrCodeContainer = ref<HTMLDivElement>()
const depositClick = ref(false)
const submitting = ref(false)
const showing = ref(false)

const onMenuHide = () => {
  depositAccount.value = {} as useraccountbase.Account
  showing.value = false
}
const onReturnWallet = () => {
  onMenuHide()
}

const onDepositClick = (row: MyLedger) => {
  depositClick.value = true
  sdk.getDepositAccount(row.CoinTypeID, (error: boolean, row?: useraccountbase.Account) => {
    depositClick.value = false
    if (error) {
      return
    }
    if (row) {
      depositAccount.value = { ...row }
    }
    showing.value = true
  })
}

const onWithdrawClick = (row: MyLedger) => {
  submitting.value = true
  _kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    submitting.value = false
    if (error) {
      void router.push({
        path: '/remainder/kyc',
        query: {
          path: '/wallet'
        }
      })
      return
    }
    if (_kyc.kyc(undefined, logined.loginedUserID as string)?.State !== kyc.KYCState.Approved) {
      void router.push({
        path: '/remainder/kyc',
        query: {
          path: '/wallet'
        }
      })
      return
    }

    if (sdk.userWithdrawAccounts(logined.loginedUserID, row.CoinTypeID).length) {
      void router.push({
        path: '/withdraw',
        query: {
          coinTypeID: row.CoinTypeID,
          type: 'ExternalAddress'
        }
      })
    } else if (transferAccounts.value.length > 0) {
      void router.push({
        path: '/withdraw',
        query: {
          coinTypeID: row.CoinTypeID,
          type: 'InternalTransfer'
        }
      })
    } else {
      void router.push({
        path: '/add/address',
        query: {
          coinTypeID: row.CoinTypeID,
          gotoWithdraw: 'true'
        }
      })
    }
  })
}

const notification = notify.useNotificationStore()
function onCopyDepositAddress () {
  copy(depositAccount.value.Address)
  notification.pushNotification({
    Title: 'MSG_DEPOSIT_ADDRESS_COPIED',
    Message: 'MSG_COPY_DEPOSIT_ADDRESS_SUCCESS',
    Popup: true,
    Type: notify.NotifyType.Success
  })
}

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
  /* {
    name: 'Last24HoursBalance',
    label: t('MSG_24_HOUR_CHANGE'),
    align: 'center',
    field: 'Last24HoursBalance'
  } */
  {
    name: 'TotalUSDTValue',
    label: t('MSG_MARKET_VALUE_USDT'),
    align: 'center',
    field: 'TotalUSDTValue'
  },
  {
    name: 'TotalJPYValue',
    label: t('MSG_MARKET_VALUE_JPY'),
    align: 'center',
    field: 'TotalJPYValue'
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center'
  }
])
</script>

<style lang='sass' scoped>
.btn-gap
  margin-right: 9px
.word-wrapper
  word-wrap: break-word

.qr-code
  border-radius: 0 0 12px 12px
.asset-button
  text-align: right
  & button
    border-radius: 8px
</style>
