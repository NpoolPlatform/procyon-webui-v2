<template>
  <h2>{{ $t("MSG_EARNINGS") }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <!-- <span class='amount'>{{ totalEarning.toFixed(4) }}</span> -->
      <span class='amount'>{{ totalProfit.toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_TOTAL_EARNINGS") }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <!-- <span class='amount'>{{ last24HoursEarning.toFixed(4) }}</span> -->
      <span class='amount'>{{ last24HoursProfit.toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_YESTERDAY_EARNING") }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{
        (totalEarning - totalWithdrawed).toFixed(4)
      }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_CURRENT_BALANCE") }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Currency,
  totalEarningUSD,
  useCurrencyStore,
  NotificationType,
  useCoinStore,
  last24HoursEarningUSD,
  useTransactionStore,
  totalWithdrawedEarningUSD,
  PriceCoinName,
  useBenefitStore,
  useGoodStore,
  SecondsEachDay
} from 'npool-cli-v2'
import { useProfitStore } from 'src/teststore/mock/profit'
// import { onMounted, ref, computed } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const totalEarning = ref(0)
const last24HoursEarning = ref(0)
const totalWithdrawed = ref(0)

const currency = useCurrencyStore()
const coin = useCoinStore()
const transaction = useTransactionStore()
const benefit = useBenefitStore()
const good = useGoodStore()
const getEarning = () => {
  benefit.getBenefits(
    {
      Message: {
        Error: {
          Title: t('MSG_GET_BENEFITS'),
          Message: t('MSG_GET_BENEFITS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    },
    () => {
      totalEarningUSD((usdAmount: number) => {
        totalEarning.value = usdAmount
      })
      last24HoursEarningUSD((usdAmount: number) => {
        last24HoursEarning.value = usdAmount
      })
    }
  )
}

const getWithdrawed = () => {
  transaction.getTransactions(
    {
      Message: {
        Error: {
          Title: t('MSG_GET_TRANSACTIONS'),
          Message: t('MSG_GET_TRANSACTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    },
    () => {
      transaction.getWithdraws(
        {
          Message: {
            Error: {
              Title: t('MSG_GET_WITHDRAWS'),
              Message: t('MSG_GET_WITHDRAWS_FAIL'),
              Popup: true,
              Type: NotificationType.Error
            }
          }
        },
        () => {
          totalWithdrawedEarningUSD((usdAmount: number) => {
            totalWithdrawed.value = usdAmount
          })
        }
      )
    }
  )
}

const getGoods = () => {
  good.getGoods(
    {
      Message: {
        Error: {
          Title: t('MSG_GET_GOODS'),
          Message: t('MSG_GET_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    },
    () => {
      getEarning()
      getWithdrawed()
    }
  )
}
const getCurrencies = () => {
  currency.getAllCoinCurrencies(
    {
      Currencies: [Currency.USD],
      Message: {
        Error: {
          Title: t('MSG_GET_CURRENCIES'),
          Message: t('MSG_GET_CURRENCIES_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    },
    () => {
      getGoods()
    }
  )
}

const getCoins = () => {
  coin.getCoins(
    {
      Message: {
        Error: {
          Title: t('MSG_GET_COINS'),
          Message: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    },
    () => {
      getCurrencies()
    }
  )
}
const profit = useProfitStore()

const totalProfit = computed(() => {
  let total = 0
  profit.Profits.forEach((el) => {
    currency.getCoinCurrency(
      coin.getCoinByID(el.CoinTypeID),
      Currency.USD,
      (currency) => {
        console.log('incoming: ', Number(el.Incoming))
        total += currency * Number(el.Incoming)
      }
    )
  })
  return total
})

const getIntervalProfits = (startAt: number, endAt: number, offset:number, limit: number) => {
  profit.getIntervalProfits({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_INTERVAL_PROFIT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (limit + offset >= profit.IntervalTotal) {
      return
    }
    getIntervalProfits(startAt, endAt, limit + offset, limit)
  })
}

const last24HoursProfit = computed(() => {
  let total = 0
  profit.IntervalProfits.forEach((el) => {
    currency.getCoinCurrency(
      coin.getCoinByID(el.CoinTypeID),
      Currency.USD,
      (currency) => {
        total += currency * Number(el.Incoming)
      }
    )
  })
  return total
})

onMounted(() => {
  getCoins()
  if (benefit.Benefits.length === 0) {
    getCoins()
    return
  }

  totalEarningUSD((usdAmount: number) => {
    totalEarning.value = usdAmount
  })
  last24HoursEarningUSD((usdAmount: number) => {
    last24HoursEarning.value = usdAmount
  })
  totalWithdrawedEarningUSD((usdAmount: number) => {
    totalWithdrawed.value = usdAmount
  })
  getIntervalProfits(new Date().getTime() / 1000 - SecondsEachDay, new Date().getTime() / 1000, 0, 100)
})

</script>
