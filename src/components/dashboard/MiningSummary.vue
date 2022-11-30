<template>
  <h2>{{ $t("MSG_EARNINGS") }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ totalProfit }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_TOTAL_EARNINGS") }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ last24HoursEarning }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t("MSG_YESTERDAY_EARNING") }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PriceCoinName, useAdminCurrencyStore, useFrontendProfitStore } from 'npool-cli-v4'
import { IntervalKey } from 'src/const/const'
import { computed } from 'vue'

const currency = useAdminCurrencyStore()
const usdCurrency = computed(() => (coinTypeID: string) => parseFloat(currency.getCurrency(coinTypeID)?.MarketValueLow as string))

const profit = useFrontendProfitStore()
const profits = computed(() => profit.Profits.Profits)
const intervalProfits = computed(() => profit.getIntervalProfitsByKey(IntervalKey.LastDay))

const totalProfit = computed(() => {
  let total = 0
  profits.value.forEach((el) => {
    total += Number(el.Incoming) * Number(usdCurrency.value)
  })
  return total.toFixed(4)
})

const last24HoursEarning = computed(() => {
  let total = 0
  intervalProfits.value.forEach((el) => {
    total += Number(el.Incoming) * Number(usdCurrency.value)
  })
  return total.toFixed(4)
})

</script>
