<template>
  <h2>{{ $t('MSG_EARNINGS') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ (_totalEarningUSD - totalWithdrawedUSD).toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} ({{ PriceCoinName }})
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ (totalEarningJPY - totalWithdrawedJPY).toFixed(4) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} (JPY)
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  Currency,
  totalEarningUSD,
  useCurrencyStore,
  NotificationType,
  useCoinStore,
  useTransactionStore,
  totalWithdrawedEarningUSD,
  totalEarningCurrency,
  totalWithdrawedEarningCurrency,
  PriceCoinName
} from 'npool-cli-v2'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _totalEarningUSD = ref(0)
const totalWithdrawedUSD = ref(0)

const totalEarningJPY = ref(0)
const totalWithdrawedJPY = ref(0)

const currency = useCurrencyStore()
const coin = useCoinStore()
const transaction = useTransactionStore()

const getEarning = () => {
  totalEarningUSD((usdAmount: number) => {
    _totalEarningUSD.value = usdAmount
  })
  totalEarningCurrency(Currency.JPY, (usdAmount: number) => {
    totalEarningJPY.value = usdAmount
  })
}

const getWithdrawed = () => {
  transaction.getTransactions({
    Message: {
      Error: {
        Title: t('MSG_GET_TRANSACTIONS'),
        Message: t('MSG_GET_TRANSACTIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    transaction.getWithdraws({
      Message: {
        Error: {
          Title: t('MSG_GET_WITHDRAWS'),
          Message: t('MSG_GET_WITHDRAWS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      totalWithdrawedEarningUSD((usdAmount: number) => {
        totalWithdrawedUSD.value = usdAmount
      })
      totalWithdrawedEarningCurrency(Currency.JPY, (usdAmount: number) => {
        totalWithdrawedJPY.value = usdAmount
      })
    })
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
    getEarning()
    getWithdrawed()
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

onMounted(() => {
  if (coin.Coins.length === 0) {
    getCoins()
  }

  totalEarningUSD((usdAmount: number) => {
    _totalEarningUSD.value = usdAmount
  })
  totalEarningCurrency(Currency.JPY, (usdAmount: number) => {
    totalEarningJPY.value = usdAmount
  })
  totalWithdrawedEarningUSD((usdAmount: number) => {
    totalWithdrawedUSD.value = usdAmount
  })
  totalWithdrawedEarningCurrency(Currency.JPY, (usdAmount: number) => {
    totalWithdrawedJPY.value = usdAmount
  })
})

</script>
