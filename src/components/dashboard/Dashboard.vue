<template>
  <div class='content'>
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
  />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { QAjaxBar } from 'quasar'
import { appcoin, coincurrency, sdk, utils } from 'src/npoolstore'
import { getCoins, getCurrencies } from 'src/api/chain'

const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))

const goodProfits = computed(() => sdk.ledgerProfit.goodProfits(utils.IntervalKey.All))
const intervalGoodProfits = computed(() => sdk.ledgerProfit.goodProfits(utils.IntervalKey.LastDay))

const coinProfits = computed(() => sdk.ledgerProfit.coinProfits(utils.IntervalKey.All))
const intervalCoinProfits = computed(() => sdk.ledgerProfit.coinProfits(utils.IntervalKey.LastDay))

const miningRewards = computed(() => sdk.ledgerStatement.miningRewards.value)

const coin = appcoin.useAppCoinStore()
const currency = coincurrency.useCurrencyStore()

onMounted(() => {
  if (!goodProfits.value?.length) {
    sdk.ledgerProfit.getGoodProfits(utils.IntervalKey.All, 0, Math.ceil(new Date().getTime() / 1000), 0, 0)
  }
  if (!intervalGoodProfits.value?.length) {
    sdk.ledgerProfit.getGoodProfits(
      utils.IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - utils.SecondsPerDay,
      Math.ceil(new Date().getTime() / 1000),
      0,
      0
    )
  }
  if (!coinProfits.value.length) {
    sdk.ledgerProfit.getCoinProfits(utils.IntervalKey.All, 0, Math.ceil(new Date().getTime() / 1000), 0, 0)
  }
  if (!intervalCoinProfits.value?.length) {
    sdk.ledgerProfit.getCoinProfits(
      utils.IntervalKey.LastDay,
      Math.ceil(new Date().getTime() / 1000) - utils.SecondsPerDay,
      Math.ceil(new Date().getTime() / 1000),
      0,
      0
    )
  }
  if (!sdk.powerRentalOrder.powerRentalOrders.value?.length) {
    sdk.powerRentalOrder.getMyPowerRentalOrders(0, 0)
  }
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }
  if (!currency.currencies()) {
    getCurrencies(0, 100)
  }
  if (!miningRewards.value?.length) {
    sdk.ledgerStatement.getMiningRewards(0, Math.ceil(new Date().getTime() / 1000), 0, 0)
  }
})

</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
