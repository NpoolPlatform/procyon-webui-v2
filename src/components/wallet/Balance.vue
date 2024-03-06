<template>
  <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ utils.getLocaleString(totalUSDTBalance?.toFixed(4)) }}</span>
      <span class='unit'>{{ constant.PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} ({{ constant.PriceCoinName }})
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ utils.getLocaleString(totalJPYBalance?.toFixed(4)) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }} (JPY)
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { constant, coincurrency, ledger, fiatcurrency, utils, user } from 'src/npoolstore'
import { computed } from 'vue'

const general = ledger.useLedgerStore()
const _coincurrency = coincurrency.useCurrencyStore()
const _fiatcurrency = fiatcurrency.useFiatCurrencyStore()
const logined = user.useLocalUserStore()

const totalUSDTBalance = computed(() => {
  let total = 0
  general.ledgers(undefined, logined.loginedUserID).forEach((el) => {
    total += Number(el.Spendable) * _coincurrency.currency(el.CoinTypeID)
  })
  return total
})
const totalJPYBalance = computed(() => totalUSDTBalance.value * _fiatcurrency.jpy())
</script>
