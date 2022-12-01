<template>
  <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ totalUSDTBalance.toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} ({{ PriceCoinName }})
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ totalJPYBalance.toFixed(4) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} (JPY)
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { PriceCoinName, useAdminCurrencyStore, useFrontendGeneralStore } from 'npool-cli-v4'
import { computed } from 'vue'

const general = useFrontendGeneralStore()
const currency = useAdminCurrencyStore()

const totalUSDTBalance = computed(() => {
  let total = 0
  general.Generals.Generals.forEach((el) => {
    total += Number(el.Spendable) * Number(currency.getCurrency(el.CoinTypeID))
  })
  return total
})

const totalJPYBalance = computed(() => {
  let total = 0
  general.Generals.Generals.forEach((el) => {
    total += Number(el.Spendable) * Number(currency.getCurrency(el.CoinTypeID))
  })
  return total
})

</script>
