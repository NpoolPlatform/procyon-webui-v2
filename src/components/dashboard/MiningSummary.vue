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
  useCoinStore,
  PriceCoinName
} from 'npool-cli-v2'
import { IntervalKey } from 'src/const/const'
import { useLocalLedgerStore } from 'src/localstore/ledger'
import { useProfitStore } from 'src/teststore/mock/profit'
import { computed } from 'vue'

const currency = useCurrencyStore()
const coin = useCoinStore()
const profit = useProfitStore()

const localledger = useLocalLedgerStore()

const totalProfit = computed(() => localledger.Profit.USDAmount)
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

</script>
