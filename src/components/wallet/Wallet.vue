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
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  appcoin,
  ledger,
  coincurrency,
  fiatcurrency,
  notify,
  fiat,
  sdk
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
const coin = appcoin.useAppCoinStore()
const _coincurrency = coincurrency.useCurrencyStore()
const _fiatcurrency = fiatcurrency.useFiatCurrencyStore()

const withdrawAccounts = sdk.userWithdrawAccount.userWithdrawAccounts(undefined, undefined)
const transferAccounts = sdk.userTransferAccount.userTransferAccounts()

onMounted(() => {
  if (!general.ledgers().length) {
    getGenerals(0, 100)
  }
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }
  if (!withdrawAccounts.length) {
    sdk.userWithdrawAccount.getMyUserWithdrawAccounts(0, 0)
  }
  if (!transferAccounts.length) {
    sdk.userTransferAccount.getTransfers(0, 100)
  }
  if (!_coincurrency.currencies().length) {
    getCurrencies(0, 100)
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

const getFiatCurrency = () => {
  _fiatcurrency.getFiatCurrency({
    FiatName: fiat.FiatType.JPY
  }, () => {
    // TODO
  })
}
</script>
