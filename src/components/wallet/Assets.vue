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
import { computed, defineAsyncComponent } from 'vue'
import {
  useCurrencyStore,
  BenefitModel,
  useKYCStore,
  ReviewState,
  useAccountStore
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { QAjaxBar } from 'quasar'
import { useLocalLedgerStore } from 'src/localstore/ledger'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const currencies = useCurrencyStore()
const kyc = useKYCStore()
const localledger = useLocalLedgerStore()

const balanceGenerals = computed(() => localledger.Generals)
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

</script>

<stype lang='sass' scoped>
</stype>
