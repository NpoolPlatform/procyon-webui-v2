<template>
  <div class='content'>
    <Balance />
    <div class='hr' />
    <Assets />
    <div class='hr' />
    <Transactions />
    <div class='hr' />
    <WithdrawRecords />
    <div class='hr' />
    <WithdrawAddresses />
    <div class='hr' />
    <TransferAccounts />
    <div class='hr' />
  </div>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
  />
</template>

<script setup lang="ts">
import { QAjaxBar } from 'quasar'
import { getCoins, getCurrencies } from 'src/api/chain'
import { IntervalKey } from 'src/const/const'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  accountbase,
  appcoin,
  ledger,
  useraccount,
  transferaccount,
  coincurrency,
  fiatcurrency,
  notify,
  fiat,
  constant,
  useraccountbase,
  user,
  ledgerprofit
} from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Balance = defineAsyncComponent(() => import('src/components/wallet/Balance.vue'))
const Assets = defineAsyncComponent(() => import('src/components/wallet/Assets.vue'))
const Transactions = defineAsyncComponent(() => import('src/components/wallet/Transactions.vue'))
const WithdrawAddresses = defineAsyncComponent(() => import('src/components/wallet/WithdrawAddresses.vue'))
const WithdrawRecords = defineAsyncComponent(() => import('src/components/wallet/WithdrawRecords.vue'))
const TransferAccounts = defineAsyncComponent(() => import('src/components/wallet/TransferAccounts.vue'))

const general = ledger.useLedgerStore()
const profit = ledgerprofit.useProfitStore()
const coin = appcoin.useAppCoinStore()
const account = useraccount.useUserAccountStore()
const transfer = transferaccount.useTransferAccountStore()
const _coincurrency = coincurrency.useCurrencyStore()
const _fiatcurrency = fiatcurrency.useFiatCurrencyStore()
const logined = user.useLocalUserStore()

onMounted(() => {
  if (!general.ledgers().length) {
    getGenerals(0, 100)
  }
  if (!profit.intervalProfits(undefined, logined.loginedUserID, undefined, IntervalKey.LastDay).length) {
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - constant.SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }
  if (!account.accounts(undefined).length) {
    getUserAccounts(0, 100)
  }
  if (!transfer.transferAccounts(undefined, logined.loginedUserID).length) {
    getTransfers(0, 100)
  }
  if (!_coincurrency.currencies().length) {
    getCurrencies(0, 500)
  }
  if (!_fiatcurrency.currencies().length) {
    getFiatCurrency()
  }
})

const getGenerals = (offset:number, limit: number) => {
  general.getLedgers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<ledger.Ledger>) => {
    if (error || !rows?.length) {
      return
    }
    getGenerals(limit + offset, limit)
  })
}

const getIntervalProfits = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  profit.getIntervalProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, key, (error: boolean, rows?: Array<ledgerprofit.Profit>) => {
    if (error || !rows?.length) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getTransfers = (offset: number, limit: number) => {
  transfer.getTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_TRANSFER_ACCOUNTS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, transfers?: Array<transferaccount.TransferAccount>) => {
    if (error || !transfers?.length) {
      return
    }
    getTransfers(limit + offset, limit)
  })
}

const getUserAccounts = (offset: number, limit: number) => {
  account.getUserAccounts({
    Offset: offset,
    Limit: limit,
    UsedFor: accountbase.AccountUsedFor.UserWithdraw,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, accounts?: Array<useraccountbase.Account>) => {
    if (error || !accounts?.length) return
    getUserAccounts(offset + limit, limit)
  })
}

const getFiatCurrency = () => {
  _fiatcurrency.getFiatCurrency({
    FiatName: fiat.FiatType.JPY
  }, () => {
    // TODO
  })
}
</script>
