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
            :name='coin.getCoinByID(myProps.row.CoinTypeID)?.Name'
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
          <button class='small' @click='onWithdrawClick(myProps.row)'>
            {{ $t('MSG_WITHDRAW') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import {
  useOrderStore,
  NotificationType,
  useBenefitStore,
  buildBenefits,
  useCoinStore,
  useCurrencyStore,
  Currency,
  BenefitModel,
  totalWithdrawedEarningCoin
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const order = useOrderStore()
const coin = useCoinStore()
const currencies = useCurrencyStore()
const benefit = useBenefitStore()
const benefits = computed(() => buildBenefits(order.Orders, benefit.Benefits))

interface MyBenefit extends BenefitModel {
  USDValue: number
  JPYValue: number
}
const exBenefits = computed(() => {
  const myBenefits = [] as Array<MyBenefit>

  benefits.value.forEach((benefit: BenefitModel) => {
    const myBenefit = {
      CoinTypeID: benefit.CoinTypeID,
      Balance: benefit.Balance,
      Total: benefit.Total,
      Units: benefit.Units,
      Last24Hours: benefit.Last24Hours
    } as MyBenefit
    currencies.getCoinCurrency(coin.getCoinByID(benefit.CoinTypeID), Currency.USD, (usdCurrency: number) => {
      currencies.getCoinCurrency(coin.getCoinByID(benefit.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
        totalWithdrawedEarningCoin(benefit.CoinTypeID, (amount: number) => {
          for (let i = 0; i < myBenefits.length; i++) {
            if (myBenefits[i].CoinTypeID === benefit.CoinTypeID) {
              myBenefits[i].Total = benefit.Total - amount
              myBenefits[i].USDValue = myBenefits[i].Total * usdCurrency
              myBenefits[i].JPYValue = myBenefits[i].Total * jpyCurrency
              return
            }
          }
          myBenefit.Total = benefit.Total - amount
          myBenefit.USDValue = myBenefit.Total * usdCurrency
          myBenefit.JPYValue = myBenefit.Total * jpyCurrency
          myBenefits.push(myBenefit)
        })
      })
    })
  })

  return myBenefits
})

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
    order.getOrders({
      Message: {
        Error: {
          Title: t('MSG_GET_ORDERS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
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
      // TODO
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
      // TODO
    })
  }
})

const router = useRouter()

const onWithdrawClick = (asset: BenefitModel) => {
  void router.push({
    path: '/withdraw',
    query: {
      coinTypeId: asset.CoinTypeID
    }
  })
}

</script>

<stype lang='sass' scoped>
</stype>
