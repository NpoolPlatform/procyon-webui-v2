<template>
  <ShowSwitchTable
    label='MSG_ASSETS'
    :rows='(balanceGeneral as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='Name' :props='myProps'>
          <LogoName
            :logo='coin.getCoinByID(myProps.row.CoinTypeID)?.Logo'
            :name='currencies.formatCoinName(coin.getCoinByID(myProps.row.CoinTypeID)?.Name as string)'
          />
        </q-td>
        <q-td key='Balance' :props='myProps'>
          {{ myProps.row.Balance.toFixed(4) }}
        </q-td>
        <q-td key='Last24HoursIncoming' :props='myProps'>
          {{ myProps.row.Last24HoursBalance.toFixed(4) }}
        </q-td>
        <q-td key='USDTValue' :props='myProps'>
          {{ myProps.row.USDValue.toFixed(4) }}
        </q-td>
        <q-td key='JPYValue' :props='myProps'>
          {{ myProps.row.JPYValue.toFixed(4) }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Balance <= 0.0001'>
            {{ $t('MSG_WITHDRAW') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
    skip-hijack
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent, ref } from 'vue'
import {
  NotificationType,
  useCoinStore,
  useCurrencyStore,
  Currency,
  BenefitModel,
  useKYCStore,
  ReviewState

} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { IntervalKey } from 'src/const/const'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const currencies = useCurrencyStore()

const kyc = useKYCStore()

interface BalanceGeneral{
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Balance: number
  Last24HoursBalance: number
  USDValue: number
  JPYValue: number
}
const progress = ref<QAjaxBar>()

const general = useGeneralStore()
const balanceGeneral = ref([] as Array<BalanceGeneral>)
const getAssets = () => {
  balanceGeneral.value = [] as Array<BalanceGeneral>
  general.Generals.Generals.forEach((el) => {
    const balance = {
      CoinTypeID: el.CoinTypeID,
      CoinName: el.CoinName,
      CoinLogo: el.CoinLogo,
      CoinUnit: el.CoinUnit,
      Balance: 0,
      Last24HoursBalance: 0,
      USDValue: 0,
      JPYValue: 0
    } as BalanceGeneral
    progress.value?.start()
    currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
      currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
        const usdProfit = Number(el.Incoming) * usdCurrency
        const jpProfit = Number(el.Incoming) * jpyCurrency
        const existItem = balanceGeneral.value.find((ex) => ex.CoinTypeID === el.CoinTypeID, false)
        if (existItem) {
          existItem.USDValue += usdProfit
          existItem.JPYValue += jpProfit
          existItem.Balance += Number(el.Spendable)
        } else {
          balance.USDValue = usdProfit
          balance.JPYValue = usdProfit
          balance.Balance = Number(el.Spendable)
          balanceGeneral.value.push(balance)
        }
      })
    })
  })
  // lastDayBalance
  balanceGeneral.value.forEach((el) => {
    const generals = general.IntervalGenerals.get(IntervalKey.LastDay)
    generals?.Generals.filter((elem) => elem.CoinTypeID === el.CoinTypeID).forEach((grl) => { el.Last24HoursBalance += Number(grl.Spendable) })
  })
  progress.value?.stop()
}
const table = computed(() => [
  {
    name: 'Name',
    label: t('MSG_NAME'),
    align: 'left',
    field: 'Name'
  },
  {
    name: 'Balance',
    label: t('MSG_BALANCE'),
    align: 'center',
    field: 'Balance'
  },
  {
    name: 'Last24HoursIncoming',
    label: t('MSG_24_HOUR_CHANGE'),
    align: 'center',
    field: 'Last24HoursIncoming'
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

const currency = useCurrencyStore()

const getCurrencies = () => {
  progress.value?.start()
  currency.getAllCoinCurrencies({
    Currencies: [Currency.USD],
    Message: {
      Error: {
        Title: t('MSG_GET_CURRENCIES'),
        Message: t('MSG_GET_CURRENCIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
  })
}

const getCoins = () => {
  progress.value?.start()
  coin.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    getCurrencies()
  })
}

onMounted(() => {
  getCoins()
  getAssets()
})

const router = useRouter()

const onWithdrawClick = (asset: BenefitModel) => {
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
    if (error) {
      void router.push({ path: '/kyc' })
      return
    }
    if (!kyc.KYC.Kyc || kyc.KYC.State !== ReviewState.Approved) {
      void router.push({ path: '/kyc' })
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

</script>

<stype lang='sass' scoped>
</stype>
