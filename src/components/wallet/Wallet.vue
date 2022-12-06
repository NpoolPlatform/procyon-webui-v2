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
import { SecondsEachDay } from 'npool-cli-v2'
import {
  Account,
  AccountUsedFor,
  CurrencyType,
  General,
  NotifyType,
  TransferAccount,
  useAdminAppCoinStore,
  useAdminCurrencyStore,
  useFrontendGeneralStore,
  useFrontendTransferAccountStore,
  useFrontendUserAccountStore
} from 'npool-cli-v4'
import { QAjaxBar } from 'quasar'
import { getCoins, getCurrencies } from 'src/api/chain'
import { IntervalKey } from 'src/const/const'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Balance = defineAsyncComponent(() => import('src/components/wallet/Balance.vue'))
const Assets = defineAsyncComponent(() => import('src/components/wallet/Assets.vue'))
const Transactions = defineAsyncComponent(() => import('src/components/wallet/Transactions.vue'))
const WithdrawAddresses = defineAsyncComponent(() => import('src/components/wallet/WithdrawAddresses.vue'))
const WithdrawRecords = defineAsyncComponent(() => import('src/components/wallet/WithdrawRecords.vue'))
const TransferAccounts = defineAsyncComponent(() => import('src/components/wallet/TransferAccounts.vue'))

const general = useFrontendGeneralStore()
const coin = useAdminAppCoinStore()
const account = useFrontendUserAccountStore()
const transfer = useFrontendTransferAccountStore()
const currency = useAdminCurrencyStore()

onMounted(() => {
  if (general.Generals.Generals.length === 0) {
    getGenerals(0, 100)
  }
  if (general.getIntervalGeneralsByKey(IntervalKey.LastDay).length === 0) {
    getIntervalGenerals(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
  if (account.UserAccounts.UserAccounts.length === 0) {
    getUserAccounts(0, 100)
  }
  if (transfer.TransferAccounts.TransferAccounts.length === 0) {
    getTransfers(0, 100)
  }
  if (currency.Currencies.Currencies.length === 0) {
    getCurrencies(0, 100)
  }

  if (!currency.LegalCurrencies.get(CurrencyType.JPY)) {
    currency.getLegalCurrencies({
      CurrencyType: CurrencyType.JPY,
      Message: {}
    }, () => {
    // TODO
    })
  }
})

const getGenerals = (offset:number, limit: number) => {
  general.getGenerals({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<General>) => {
    if (error || rows.length < limit) {
      return
    }
    getGenerals(limit + offset, limit)
  })
}

const getIntervalGenerals = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  general.getIntervalGenerals({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, key, (error: boolean, rows: Array<General>) => {
    if (error || rows.length < limit) {
      return
    }
    getIntervalGenerals(key, startAt, endAt, limit + offset, limit)
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
        Type: NotifyType.Error
      }
    }
  }, (transfers: Array<TransferAccount>, error: boolean) => {
    if (error || transfers.length < limit) {
      return
    }
    getTransfers(limit + offset, limit)
  })
}

const getUserAccounts = (offset: number, limit: number) => {
  account.getUserAccounts({
    Offset: offset,
    Limit: limit,
    UsedFor: AccountUsedFor.UserWithdraw,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (accounts: Array<Account>, error: boolean) => {
    if (error || accounts.length < limit) return
    getUserAccounts(offset + limit, limit)
  })
}
</script>
