<template>
  <div v-if='!hidden'>
    <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
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
  PriceCoinName,
  useGoodStore,
  useBenefitStore
} from 'npool-cli-v2'
import { onMounted, ref, defineProps, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  hidden?: boolean
}

const props = defineProps<Props>()
const hidden = toRef(props, 'hidden')

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _totalEarningUSD = ref(0)
const totalWithdrawedUSD = ref(0)

const totalEarningJPY = ref(0)
const totalWithdrawedJPY = ref(0)

const currency = useCurrencyStore()
const coin = useCoinStore()
const transaction = useTransactionStore()
const good = useGoodStore()
const benefit = useBenefitStore()

const getEarning = () => {
  benefit.getBenefits({
    Message: {
      Error: {
        Title: t('MSG_GET_BENEFITS'),
        Message: t('MSG_GET_BENEFITS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    totalEarningUSD((usdAmount: number) => {
      _totalEarningUSD.value = usdAmount
    })
    totalEarningCurrency(Currency.JPY, (usdAmount: number) => {
      totalEarningJPY.value = usdAmount
    })
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

const getGoods = () => {
  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    getEarning()
    getWithdrawed()
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
    getGoods()
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
  if (benefit.Benefits.length === 0) {
    getCoins()
    return
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
