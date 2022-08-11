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
  </div>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
    skip-hijack
  />
</template>

<script setup lang="ts">
import { Currency, NotificationType, SecondsEachDay, useAccountStore, useCoinStore, useCurrencyStore } from 'npool-cli-v2'
import { QAjaxBar } from 'quasar'
import { IntervalKey } from 'src/const/const'
import { useLocalLedgerStore } from 'src/localstore/ledger'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { useLocalTransactionStore } from 'src/teststore/mock/transaction'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const Balance = defineAsyncComponent(
  () => import('src/components/wallet/Balance.vue')
)
const Assets = defineAsyncComponent(
  () => import('src/components/wallet/Assets.vue')
)
const Transactions = defineAsyncComponent(
  () => import('src/components/wallet/Transactions.vue')
)
const WithdrawAddresses = defineAsyncComponent(
  () => import('src/components/wallet/WithdrawAddresses.vue')
)
const WithdrawRecords = defineAsyncComponent(
  () => import('src/components/wallet/WithdrawRecords.vue')
)
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const localtrans = useLocalTransactionStore()
const localledger = useLocalLedgerStore()
const coin = useCoinStore()
const currency = useCurrencyStore()
const account = useAccountStore()
const general = useGeneralStore()

const progress = ref<QAjaxBar>()

const getWithdraws = (offset: number, limit: number) => {
  localtrans.getWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
    if (localtrans.Withdraws.Withdraws.length === localtrans.Withdraws.Total) {
      localtrans.Withdraws.Withdraws = localtrans.Withdraws.Withdraws.sort((a, b) => {
        return b.CreatedAt - a.CreatedAt
      })
      return
    }
    getWithdraws(limit + offset, limit)
  })
}

const getUserGenerals = (offset:number, limit: number) => {
  general.getGenerals({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (general.Generals.Total <= general.Generals.Generals.length) {
      return
    }
    getUserGenerals(limit + offset, limit)
  })
}
const getIntervalGenerals = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  progress.value?.start()
  general.getIntervalGenerals({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, key, () => {
    if (general.IntervalGenerals.get(key)?.Generals?.length === general.IntervalGenerals.get(key)?.Total) {
      localledger.initGeneral(general.Generals.Generals)
      progress.value?.stop()
      return
    }
    getIntervalGenerals(key, startAt, endAt, limit + offset, limit)
  })
}

const getCurrencies = () => {
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
    // TODO
    account.getWithdrawAccounts({
      Message: {
        Error: {
          Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  })
}

const getCoins = () => {
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
    getCurrencies()
  })
}

const getUserDetails = (offset: number, limit: number) => {
  localtrans.getDetails({
    Offset: offset,
    Limit: limit,
    EndAt: Math.ceil(Date.now() / 1000),
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (localtrans.Details.Details.length === localtrans.Details.Total) {
      return
    }
    getUserDetails(limit + offset, limit)
  })
}
onMounted(() => {
  if (localtrans.Withdraws.Withdraws.length === 0) {
    getUserGenerals(0, 100)
    getIntervalGenerals(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
    getWithdraws(0, 100)
  }
  if (coin.Coins.length === 0) {
    getCoins()
  }
  if (localtrans.Details.Details.length === 0) {
    getUserDetails(0, 100)
  }
})
</script>
