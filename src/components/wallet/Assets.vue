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
  ReviewState
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const coin = useCoinStore()
const currencies = useCurrencyStore()
const benefit = useBenefitStore()
const benefits = computed(() => buildBenefits(order.Orders, benefit.Benefits))
const commission = computed(() => benefit.Commission)
const commissionCoin = computed(() => {
  const index = benefit.CommissionCoinSettings.findIndex((el) => el.Using)
  if (index >= 0) {
    return benefit.CommissionCoinSettings[index]
  }
  return undefined as unknown as CommissionCoinSetting
})

const kyc = useKYCStore()

interface MyBenefit extends BenefitModel {
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
      myBenefit.Total += commission.value.Total
      myBenefit.Balance += commission.value.Balance
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
      Balance: commission.value.Balance,
      Total: commission.value.Balance,
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

onMounted(() => {
  if (order.Orders.length === 0) {
    progress.value?.start()
    order.getOrders({
      Message: {
        Error: {
          Title: t('MSG_GET_ORDERS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      progress.value?.stop()
    })
  }

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
      getBenefits()
    })
  }

  if (benefit.Benefits.length === 0) {
    benefit.getBenefits({
      Message: {
        Error: {
          Title: t('MSG_GET_BENEFITS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      getBenefits()
    })
  }

  benefit.getCommission({
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSION_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    getBenefits()
  })

  if (!commissionCoin.value) {
    benefit.getCommissionCoinSettings({
      Message: {
        Error: {
          Title: t('MSG_GET_COMMISSION_COIN_SETTINGS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      getBenefits()
    })
  }
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
