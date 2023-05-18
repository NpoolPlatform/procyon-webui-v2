<template>
  <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ util.getLocaleString(totalUSDTBalance.toFixed(4)) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} ({{ PriceCoinName }})
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ util.getLocaleString(totalJPYBalance.toFixed(4)) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} (JPY)
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { PriceCoinName, useAdminCurrencyStore, useFrontendGeneralStore, useAdminFiatCurrencyStore, useLocaleStringStore } from 'npool-cli-v4'
import { computed } from 'vue'

const util = useLocaleStringStore()

const general = useFrontendGeneralStore()
const currency = useAdminCurrencyStore()
const fiat = useAdminFiatCurrencyStore()

const totalUSDTBalance = computed(() => {
  let total = 0
  general.Generals.Generals.forEach((el) => {
    total += Number(el.Spendable) * currency.getUSDCurrency(el.CoinTypeID)
  })
  return total
})
const totalJPYBalance = computed(() => totalUSDTBalance.value * fiat.getJPYCurrency())
</script>
