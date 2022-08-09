<template>
  <div v-if='!hidden'>
    <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
    <div class='earnings-summary'>
      <div class='earnings-figure'>
        <span class='amount'>{{ totalBalance(Currency.USD).toFixed(4) }}</span>
        <span class='unit'>{{ PriceCoinName }}</span>
        <div class='hr' />
        <h4 class='description'>
          {{ $t('MSG_CURRENT_BALANCE') }} ({{ PriceCoinName }})
        </h4>
      </div>
      <div class='earnings-figure'>
        <span class='amount'>{{ totalBalance(Currency.JPY).toFixed(4) }}</span>
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
  useCurrencyStore,
  useCoinStore,
  PriceCoinName

} from 'npool-cli-v2'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { defineProps, toRef, computed } from 'vue'

interface Props {
  hidden?: boolean
}

const props = defineProps<Props>()
const hidden = toRef(props, 'hidden')

const currency = useCurrencyStore()
const coin = useCoinStore()
const general = useGeneralStore()
const totalBalance = computed(() => (coinCurrency: Currency) => {
  let total = 0
  general.Generals.Generals.forEach((el) => {
    if (Number(el.Spendable) > 0) {
      currency.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), coinCurrency, (currency: number) => {
        total += Number(el.Spendable) * currency
      })
    }
  })
  return total
})

</script>
