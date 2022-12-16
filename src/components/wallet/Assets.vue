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
            :name='myProps.row.CoinName'
          />
        </q-td>
        <q-td key='Balance' :props='myProps'>
          {{ myProps.row.Balance?.toFixed(4) }} {{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='Last24HoursBalance' :props='myProps'>
          {{ myProps.row.Last24HoursBalance?.toFixed(4) }}{{ myProps.row.CoinUnit }}
        </q-td>
        <q-td key='TotalUSDTValue' :props='myProps'>
          {{ myProps.row.TotalUSDValue?.toFixed(4) }}
        </q-td>
        <q-td key='TotalJPYValue' :props='myProps'>
          {{ myProps.row.TotalJPYValue?.toFixed(4) }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Balance <= 0.0001 || submitting || depositClick || myProps.row.CoinDisabled'>
            {{ $t('MSG_WITHDRAW') }}
          </button>
          <span class='btn-gap' />
          <button class='small' @click='onDepositClick(myProps.row)' :disabled='!coin.forPay(myProps.row.CoinTypeID) || myProps.row.CoinDisabled || depositClick'>
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
            <h5>{{ depositAccount?.CoinName }} {{ $t('MSG_DEPOSIT_ADDRESS') }}</h5>
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
              {{ depositAccount?.CoinName }}
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
import {
  Account,
  AccountUsedFor,
  General,
  KYCState,
  NotifyType,
  useAdminAppCoinStore,
  useAdminCurrencyStore,
  useFrontendGeneralStore,
  useFrontendKYCStore,
  useFrontendTransferAccountStore,
  useFrontendUserAccountStore,
  useNotificationStore
} from 'npool-cli-v4'
import { IntervalKey } from 'src/const/const'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))

interface MyGeneral extends General {
  Balance: number;
  Last24HoursBalance: number;
  TotalUSDValue: number;
  TotalJPYValue: number;
}

const router = useRouter()
const coin = useAdminAppCoinStore()
const kyc = useFrontendKYCStore()
const currency = useAdminCurrencyStore()

const general = useFrontendGeneralStore()
const generals = computed(() => {
  return Array.from(general.Generals.Generals.filter((el) => !coin.preSale(el.CoinTypeID) && el.CoinDisplay)).map((el) => {
    return {
      ...el,
      Balance: Number(el.Spendable),
      Last24HoursBalance: general.getIntervalInComing(IntervalKey.LastDay, el.CoinTypeID),
      TotalUSDValue: Number(el.Spendable) * currency.getUSDCurrency(el.CoinTypeID),
      TotalJPYValue: Number(el.Spendable) * currency.getUSDCurrency(el.CoinTypeID) * currency.getJPYCurrency()
    } as MyGeneral
  }).sort((a, b) => a.TotalUSDValue > b.TotalUSDValue ? -1 : 1)
})

const transferAccount = useFrontendTransferAccountStore()
const transfers = computed(() => transferAccount.TransferAccounts.TransferAccounts)

const account = useFrontendUserAccountStore()
const depositAccount = ref({} as Account)

const qrCodeContainer = ref<HTMLDivElement>()
const depositClick = ref(false)
const submitting = ref(false)
const showing = ref(false)

const onMenuHide = () => {
  depositAccount.value = {} as Account
  showing.value = false
}
const onReturnWallet = () => {
  onMenuHide()
}

const onDepositClick = (row: MyGeneral) => {
  depositClick.value = true
  account.getDepositAccount({
    CoinTypeID: row.CoinTypeID,
    UsedFor: AccountUsedFor.UserDeposit,
    Message: {
      Error: {
        Title: t('MSG_FAIL_TO_GET_DEPOSIT_ACCOUNT'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (row: Account, error: boolean) => {
    depositClick.value = false
    if (error) {
      return
    }
    depositAccount.value = { ...row }
    showing.value = true
  })
}
const onWithdrawClick = (row: MyGeneral) => {
  submitting.value = true
  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    submitting.value = false
    if (error) {
      void router.push({ path: '/kyc' })
      return
    }
    if (kyc.KYC?.State !== KYCState.Approved) {
      void router.push({ path: '/kyc' })
      return
    }

    if (account.getWithdrawAddressByID(row.CoinTypeID)) {
      void router.push({
        path: '/withdraw',
        query: {
          coinTypeID: row.CoinTypeID,
          type: 'ExternalAddress'
        }
      })
    } else if (transfers.value.length > 0) {
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

const notification = useNotificationStore()
function onCopyDepositAddress () {
  copy(depositAccount.value.Address)
  notification.Notifications.push({
    Title: t('MSG_DEPOSIT_ADDRESS_COPIED'),
    Message: t('MSG_COPY_DEPOSIT_ADDRESS_SUCCESS'),
    Popup: true,
    Type: NotifyType.Success
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
  {
    name: 'Last24HoursBalance',
    label: t('MSG_24_HOUR_CHANGE'),
    align: 'center',
    field: 'Last24HoursBalance'
  },
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
</style>
