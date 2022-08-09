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
      <span class='amount'>{{ last24HoursEarning.toFixed(4) }}</span>
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
  useCurrencyStore,
  NotificationType,
  useCoinStore,
  PriceCoinName,
  SecondsEachDay
} from 'npool-cli-v2'
import { useProfitStore } from 'src/teststore/mock/profit'
// import { onMounted, ref, computed } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const totalEarning = ref(0)
const totalWithdrawed = ref(0)

const currency = useCurrencyStore()
const coin = useCoinStore()

const profit = useProfitStore()

const totalProfit = computed(() => {
  let total = 0
  profit.Profits.Profits.forEach((el) => {
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

enum IntervalKey {
  All = 'All',
  LastDay = 'LastDay',
  LastMonth = 'LastMonty'
}

const getIntervalProfits = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
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
  }, key, () => {
    if (profit.CoinProfits.get(key)?.Profits?.length === profit.CoinProfits.get(key)?.Total) {
      return
    }
    getIntervalProfits(key, startAt, endAt, limit + offset, limit)
  })
}

const getProfits = (offset:number, limit: number) => {
  profit.getProfits({
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
    if (profit.Profits.Total === profit.Profits.Profits.length) {
      return
    }
    getProfits(limit + offset, limit)
  })
}

const last24HoursEarning = computed(() => {
  let total = 0
  profit.GoodProfits.get(IntervalKey.LastDay)?.Profits?.forEach((el) => {
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
  if (profit.CoinProfits.size === 0) {
    getProfits(0, 100)
    getIntervalProfits(
      IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
      Math.ceil(new Date().getTime() / 1000),
      0, 100)
  }
})

</script>
