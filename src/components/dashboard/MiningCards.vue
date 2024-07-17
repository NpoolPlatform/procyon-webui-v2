<template>
  <h2>{{ $t('MSG_MINING_DASHBOARD') }}</h2>
  <MiningCard
    v-for='goodProfit in goodProfits'
    :key='goodProfit.CoinTypeID'
    :profit='goodProfit'
  />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { MyGoodProfit } from 'src/localstore'
import { appcoin, coincurrency, utils, apppowerrental, sdk } from 'src/npoolstore'

const MiningCard = defineAsyncComponent(() => import('src/components/dashboard/MiningCard.vue'))

const currency = coincurrency.useCurrencyStore()
const coin = appcoin.useAppCoinStore()

const getTBD = computed(() => (appGoodID: string) => {
  return sdk.appPowerRental.description(appGoodID, 5)?.length > 0 ? sdk.appPowerRental.description(appGoodID, 5) : '*'
})

const goodProfits = computed(() => Array.from(sdk.ledgerProfit.goodProfits(utils.IntervalKey.All)).map((el) => {
  const _good = sdk.appPowerRental.appPowerRental(el.AppGoodID) as apppowerrental.AppPowerRental
  const now = Math.floor(Date.now() / 1000)

  const remain = now - _good?.ServiceStartAt >= 0 ? now - _good?.ServiceStartAt : 0
  const daysMined = Math.floor(remain / 24 / 60 / 60)

  const durationDays = Number(_good?.MaxOrderDurationSeconds / 60 / 60 / 24)

  const daysRemaining = durationDays - daysMined > 0 ? durationDays - daysMined : 0
  return {
    ...el,
    Units: el.Units,
    CoinPreSale: coin.preSale(undefined, el.CoinTypeID),
    TotalInComing: Number(el.Incoming),
    TotalUSDInComing: currency.currency(el.CoinTypeID) * Number(el.Incoming),
    Last24HoursInComing: sdk.ledgerProfit.totalIncoming(utils.IntervalKey.LastDay, el.CoinTypeID, el.AppGoodID),
    Last24HoursUSDInComing: currency.currency(el.CoinTypeID) * sdk.ledgerProfit.totalIncoming(utils.IntervalKey.LastDay, el.CoinTypeID, el.AppGoodID),
    Last30DaysInComing: sdk.ledgerProfit.totalIncoming(utils.IntervalKey.LastMonth, el.CoinTypeID, el.AppGoodID),
    Last30DaysUSDInComing: currency.currency(el.CoinTypeID) * sdk.ledgerProfit.totalIncoming(utils.IntervalKey.LastMonth, el.CoinTypeID, el.AppGoodID),
    GoodSaleEndAt: _good?.SaleEndAt,
    TotalEstimatedDailyReward: Number(el.Units) * parseFloat(good.good(undefined, el.AppGoodID)?.LastUnitRewardAmount as string),
    MiningStartDate: _good?.ServiceStartAt > Math.ceil(Date.now() / 1000) ? getTBD.value(el.AppGoodID) : utils.formatTime(_good?.ServiceStartAt, 'YYYY-MM-DD'),
    DaysMined: daysMined > durationDays ? durationDays : daysMined,
    DaysRemaining: daysRemaining
  } as MyGoodProfit
}).sort((a, b) => {
  if (a.CoinUnit.localeCompare(b.CoinUnit, 'zh-CN')) {
    return a.CoinUnit.localeCompare(b.CoinUnit, 'zh-CN')
  } else {
    return a.GoodSaleEndAt > b.GoodSaleEndAt ? -1 : 1
  }
}))
</script>
