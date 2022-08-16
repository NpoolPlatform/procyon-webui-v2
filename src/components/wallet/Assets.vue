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
        </q-td>
        <q-td key='DepositButtons' :props='myProps'>
          <button class='small' @click='onDepositClick(myProps.row)' :disabled='false'>
            {{ $t('MSG_DEPOSIT') }}
          </button>
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref } from 'vue'
import {
  useCurrencyStore,
  BenefitModel,
  useKYCStore,
  ReviewState,
  useAccountStore
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BalanceGeneral, useLocalLedgerStore } from 'src/localstore/ledger'
import { Account, useLocalAccountStore } from 'src/teststore/mock/account'
import { AccountUsedFor } from 'src/teststore/mock/account/state'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const currencies = useCurrencyStore()
const kyc = useKYCStore()
const localledger = useLocalLedgerStore()
const submitting = ref(false)

// const balanceGenerals = computed(() => localledger.generals)
const balanceGenerals = computed(() : Array<BalanceGeneral> => {
  console.log(localledger.Generals)
  return [
    {
      CoinTypeID: '4db85c80-d0d7-4248-8511-b96ed53c9bc2',
      CoinName: 'TTether ERC20',
      CoinLogo: 'https://img0.baidu.com/it/u=1761918113,2556123655&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      CoinUnit: 'USD',
      Balance: 99.99,
      Last24HoursBalance: 56.66,
      USDValue: 99.99,
      JPYValue: 124535.9897
    }
  ]
})

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
  },
  {
    name: 'DepositButtons',
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
const ant = ref({} as Account)

const createUserAccount = (row: BalanceGeneral) => {
  laccount.createAccount({
    CoinTypeID: row.CoinTypeID,
    UsedFor: AccountUsedFor.UserDeposit,
    Message: {}
  }, (error: boolean) => {
    if (error) {
      return
    }
    showDepositDialog(row.CoinTypeID)
  })
}
const onDepositClick = (row: BalanceGeneral) => {
  const existingItem = laccount.getUserAccountByCoinTypeID(row.CoinTypeID)
  if (!existingItem) {
    createUserAccount(row)
    return
  }
  showDepositDialog(row.CoinTypeID)
}
const showDepositDialog = (coinTypeID: string) => {
  ant.value = laccount.getUserAccountByCoinTypeID(coinTypeID) as Account
  console.log('ant.value: ', ant.value)
  // NOT FINISHED
}
</script>

<stype lang='sass' scoped>
</stype>
