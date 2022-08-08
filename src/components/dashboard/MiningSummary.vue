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
    <!-- <div class='earnings-figure'>
      <span class='amount'>{{
        (totalEarning - totalWithdrawed).toFixed(4)
      }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_CURRENT_BALANCE") }}
      </h4>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import {
  Currency,
  useCurrencyStore,
  NotificationType,
  useCoinStore,
  PriceCoinName,
  SecondsEachDay
} from 'npool-cli-v2'
import { useProfitStore } from 'src/teststore/mock/profit'
// import { onMounted, ref, computed } from 'vue'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const currency = useCurrencyStore()
const coin = useCoinStore()
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
      // TODO NOTHING
      profit.IntervalProfits = []
      getIntervalProfits(~~(new Date().getTime() / 1000 - SecondsEachDay), ~~(new Date().getTime() / 1000), 0, 100)
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
})

</script>
