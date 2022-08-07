<template>
  <ShowSwitchTable
    label='MSG_ASSETS'
    :rows='(exBenefits as Array<never>)'
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
          {{ myProps.row.Total.toFixed(4) }}
        </q-td>
        <q-td key='Last24HoursIncoming' :props='myProps'>
          {{ myProps.row.Last24Hours.toFixed(4) }}
        </q-td>
        <q-td key='USDTValue' :props='myProps'>
          {{ myProps.row.USDValue.toFixed(4) }}
        </q-td>
        <q-td key='JPYValue' :props='myProps'>
          {{ myProps.row.JPYValue.toFixed(4) }}
        </q-td>
        <q-td key='ActionButtons' :props='myProps'>
          <button class='small' @click='onWithdrawClick(myProps.row)' :disabled='myProps.row.Total <= 0.0001'>
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
  useOrderStore,
  NotificationType,
  useBenefitStore,
  buildBenefits,
  useCoinStore,
  useCurrencyStore,
  Currency,
  BenefitModel,
  totalWithdrawedEarningCoin,
  useKYCStore,
  CommissionCoinSetting,
  ReviewState,
  useBillingStore,
  totalPaymentBalanceUSD,
  totalPaymentBalanceCurrency,
  useTransactionStore,
  TransactionState,
  WithdrawType,
  InvalidID
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'
import { useGeneralStore } from 'src/teststore/mock/ledger'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const coin = useCoinStore()
const currencies = useCurrencyStore()
const benefit = useBenefitStore()
const billing = useBillingStore()

const benefits = computed(() => buildBenefits(order.Orders, benefit.Benefits))
const commission = computed(() => benefit.Commission)
const commissionCoin = computed(() => {
  const index = benefit.CommissionCoinSettings.findIndex((el) => el.Using)
  if (index >= 0) {
    return benefit.CommissionCoinSettings[index]
  }
  return undefined as unknown as CommissionCoinSetting
})

const _totalPaymentBalanceUSD = ref(0)
const totalPaymentBalanceJPY = ref(0)
const _totalWithdrawPaymentBalanceUSD = ref(0)
const totalWithdrawPaymentBalanceJPY = ref(0)

const transaction = useTransactionStore()

const kyc = useKYCStore()

interface MyBenefit extends BenefitModel {
  USDValue: number
  JPYValue: number
}
interface BalanceGeneral{
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Balance: number
  Last24Hours: number
  USDValue: number
  JPYValue: number
}
const progress = ref<QAjaxBar>()
const exBenefits = ref([] as Array<MyBenefit>)

const getBenefits = () => {
  exBenefits.value = [] as Array<MyBenefit>
  let commissionIncluded = false

  benefits.value.forEach((benefit: BenefitModel) => {
    const myBenefit = {
      CoinTypeID: benefit.CoinTypeID,
      Balance: benefit.Balance,
      Total: benefit.Total,
      Units: benefit.Units,
      Last24Hours: benefit.Last24Hours
    } as MyBenefit

    if (commissionCoin.value?.CoinTypeID === benefit.CoinTypeID) {
      myBenefit.Total += commission.value.Total + _totalPaymentBalanceUSD.value - _totalWithdrawPaymentBalanceUSD.value
      myBenefit.Balance += commission.value.Balance + _totalPaymentBalanceUSD.value - _totalWithdrawPaymentBalanceUSD.value
      commissionIncluded = true
    }

    progress.value?.start()
    currencies.getCoinCurrency(coin.getCoinByID(benefit.CoinTypeID), Currency.USD, (usdCurrency: number) => {
      currencies.getCoinCurrency(coin.getCoinByID(benefit.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
        totalWithdrawedEarningCoin(benefit.CoinTypeID, (amount: number) => {
          progress.value?.stop()
          for (let i = 0; i < exBenefits.value.length; i++) {
            if (exBenefits.value[i].CoinTypeID === benefit.CoinTypeID) {
              exBenefits.value[i].Total = benefit.Total - amount
              exBenefits.value[i].USDValue = exBenefits.value[i].Total * usdCurrency
              exBenefits.value[i].JPYValue = exBenefits.value[i].Total * jpyCurrency
              return
            }
          }
          myBenefit.Total = benefit.Total - amount
          myBenefit.USDValue = myBenefit.Total * usdCurrency
          myBenefit.JPYValue = myBenefit.Total * jpyCurrency
          exBenefits.value.push(myBenefit)
        })
      })
    })
  })

  if (!commissionIncluded && commissionCoin.value && commission.value.Balance > 0) {
    const myBenefit = {
      CoinTypeID: commissionCoin.value.CoinTypeID,
      Balance: commission.value.Balance + _totalPaymentBalanceUSD.value - _totalWithdrawPaymentBalanceUSD.value,
      Total: commission.value.Balance + _totalPaymentBalanceUSD.value - _totalWithdrawPaymentBalanceUSD.value,
      Units: 0,
      Last24Hours: 0
    } as MyBenefit

    currencies.getCoinCurrency(coin.getCoinByID(commissionCoin.value.CoinTypeID), Currency.USD, (usdCurrency: number) => {
      currencies.getCoinCurrency(coin.getCoinByID(commissionCoin.value.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
        for (let i = 0; i < exBenefits.value.length; i++) {
          if (exBenefits.value[i].CoinTypeID === commissionCoin.value.CoinTypeID) {
            exBenefits.value[i].Total = commission.value.Balance
            exBenefits.value[i].USDValue = commission.value.Balance * usdCurrency
            exBenefits.value[i].JPYValue = commission.value.Balance * jpyCurrency
            return
          }
        }
        myBenefit.USDValue = myBenefit.Total * usdCurrency
        myBenefit.JPYValue = myBenefit.Total * jpyCurrency
        exBenefits.value.push(myBenefit)
      })
    })
  }
}

const general = useGeneralStore()
const balanceGeneral = ref([] as Array<BalanceGeneral>)
const getAssets = () => {
  balanceGeneral.value = [] as Array<BalanceGeneral>
  general.Generals.forEach((el) => {
    const balance = {
      CoinTypeID: el.CoinTypeID,
      CoinName: el.CoinName,
      CoinLogo: el.CoinLogo,
      CoinUnit: el.CoinUnit,
      Balance: 0,
      Last24Hours: 0,
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
  // last24Hours balance
  balanceGeneral.value.forEach((el) => {
    general.IntervalGenerals.filter((elem) => elem.CoinTypeID === el.CoinTypeID).forEach((grl) => { el.Last24Hours += Number(grl.Spendable) })
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

const benefitTimeout = ref(-1)

const getPaymentBalances = () => {
  progress.value?.start()
  billing.getPaymentBalances({
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENT_BALANCES'),
        Message: t('MSG_GET_PAYMENT_BALANCES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    totalPaymentBalanceUSD((usdAmount: number) => {
      _totalPaymentBalanceUSD.value = usdAmount
      if (benefitTimeout.value >= 0) {
        window.clearTimeout(benefitTimeout.value)
      }
      benefitTimeout.value = window.setTimeout(() => {
        totalWithdrawPaymentBalanceJPY.value = 0
        _totalWithdrawPaymentBalanceUSD.value = 0
        transaction.Withdraws.filter((el) => (el.State === ReviewState.Approved || el.State === ReviewState.Wait) && el.Withdraw.WithdrawType === WithdrawType.PaymentBalance).forEach((el) => {
          if (el.Withdraw.PlatformTransactionID === InvalidID && el.State === ReviewState.Wait) {
            totalWithdrawPaymentBalanceJPY.value += el.Withdraw.Amount
            _totalWithdrawPaymentBalanceUSD.value += el.Withdraw.Amount
            return
          }
          const index = transaction.Transactions.findIndex((tel) => tel.ID === el.Withdraw.PlatformTransactionID && tel.State !== TransactionState.Fail && tel.State !== TransactionState.Rejected)
          if (index >= 0) {
            totalWithdrawPaymentBalanceJPY.value += transaction.Transactions[index].Amount
            _totalWithdrawPaymentBalanceUSD.value += transaction.Transactions[index].Amount
          }
        })
        currencies.getUSDTCurrency(Currency.JPY, (amount: number) => {
          totalWithdrawPaymentBalanceJPY.value = totalWithdrawPaymentBalanceJPY.value * amount
          getBenefits()
        })
      }, 1000)
    })
    totalPaymentBalanceCurrency(Currency.JPY, (amount: number) => {
      totalPaymentBalanceJPY.value = amount
      if (benefitTimeout.value >= 0) {
        window.clearTimeout(benefitTimeout.value)
      }
      benefitTimeout.value = window.setTimeout(() => {
        transaction.Withdraws.filter((el) => (el.State === ReviewState.Approved || el.State === ReviewState.Wait) && el.Withdraw.WithdrawType === WithdrawType.PaymentBalance).forEach((el) => {
          if (el.Withdraw.PlatformTransactionID === InvalidID && el.State === ReviewState.Wait) {
            totalWithdrawPaymentBalanceJPY.value += el.Withdraw.Amount
            _totalWithdrawPaymentBalanceUSD.value += el.Withdraw.Amount
            return
          }
          const index = transaction.Transactions.findIndex((tel) => tel.ID === el.Withdraw.PlatformTransactionID && tel.State !== TransactionState.Fail && tel.State !== TransactionState.Rejected)
          if (index >= 0) {
            totalWithdrawPaymentBalanceJPY.value += transaction.Transactions[index].Amount
            _totalWithdrawPaymentBalanceUSD.value += transaction.Transactions[index].Amount
          }
        })
        currencies.getUSDTCurrency(Currency.JPY, (amount: number) => {
          totalWithdrawPaymentBalanceJPY.value = totalWithdrawPaymentBalanceJPY.value * amount
          getBenefits()
        })
      }, 1000)
    })
  })
}

const getTransactions = () => {
  progress.value?.start()
  transaction.getWithdraws({
    Message: {}
  }, () => {
    progress.value?.stop()
    getPaymentBalances()
  })
}

const getWithdraws = () => {
  progress.value?.start()
  transaction.getTransactions({
    Message: {}
  }, () => {
    progress.value?.stop()
    getTransactions()
  })
}

const getCommissionSettings = () => {
  progress.value?.start()
  benefit.getCommissionCoinSettings({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_COIN_SETTINGS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    getWithdraws()
  })
}

const fetchBenefits = () => {
  progress.value?.start()
  benefit.getBenefits({
    Message: {
      Error: {
        Title: t('MSG_GET_BENEFITS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    getCommissionSettings()
  })
}

const getCommission = () => {
  progress.value?.start()
  benefit.getCommission({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    fetchBenefits()
  })
}

const getOrders = () => {
  progress.value?.start()
  order.getOrders({
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS'),
        Message: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    progress.value?.stop()
    getCommission()
  })
}

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
    getOrders()
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
