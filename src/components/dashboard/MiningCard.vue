<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='goodProfit?.CoinLogo'>
      </div>
      <h3 class='mining-title'>
        <div v-html='$t(sdk.appPowerRental.displayName(target?.AppGoodID as string, 2))' />
      </h3>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : utils.getLocaleString(parseFloat(goodProfit?.TotalInComing?.toFixed(4))) }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : utils.getLocaleString(parseFloat(goodProfit?.Last24HoursInComing?.toFixed(4))) }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}: </span>
        <span class='value'>{{ utils.getLocaleString(goodProfit?.Units) }}</span>
        <span class='sub-value'>{{ goodProfit.GoodQuantityUnit }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <div class='line'>
          <span class='label'>{{ $t('MSG_MINING_START_DATE') }}:</span>
          <span class='value'>
            {{ goodProfit?.MiningStartDate ? $t(goodProfit?.MiningStartDate) : '*' }}
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>
            {{ utils.getLocaleString(goodProfit?.ServicePeriod) }}
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_DAYS_MINED') }}:</span>
          <span class='value'>
            {{ utils.getLocaleString(goodProfit?.DaysMined) }}
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_DAYS_REMAINING') }}:</span>
          <span class='value'>
            {{ utils.getLocaleString(goodProfit?.DaysRemaining) }}
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : utils.getLocaleString(parseFloat((goodProfit.Last24HoursInComing / deservedRatio * techServiceFee)?.toFixed(4))) }}
            <span class='unit'>{{ goodProfit?.CoinUnit }} ({{ target?.TechniqueFeeRatio }}%)</span>
          </span>
        </div>
        <div class='line' v-if='goodProfit.AppGoodID === "e6cf6276-adc8-42c1-8452-5458931f74c5"'>
          <span class='label'>{{ $t('MSG_PROVER_INCENTIVE') }}:</span>
          <span class='value'>
            {{ goodProfit.TotalEstimatedDailyReward === 0 ? '*' : utils.getLocaleString(goodProfit.TotalEstimatedDailyReward) }}
            <span class='unit'>{{ $t('MSG_CREDITS') }}</span></span>
        </div>
        <div class='warning' v-if='sdk.appPowerRental.description(target?.AppGoodID as string, 3)?.length > 0'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t(sdk.appPowerRental.description(target?.AppGoodID as string, 3))' />
        </div>
      </div>
    </q-slide-transition>
    <div class='buttons'>
      <button :class='[ "alt show-more", short ? "" : "open" ]' @click='onExpandClick'>
        <img :src='chevrons'>
      </button>
      <button class='alt' @click='onExportClick' :disabled='exportMiningRewards?.length === 0'>
        {{ $t('MSG_EXPORT_DAILY_OUTPUT_CSV') }}
      </button>
      <button
        :class='["alt", showProductPage ? "" : "in-active"]'
        :disabled='!showProductPage'
        @click='onPurchaseClick(target as apppowerrental.AppPowerRental)'
      >
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import saveAs from 'file-saver'
import { MyGoodProfit } from 'src/localstore'
import { defineProps, toRef, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stringify } from 'csv-stringify/sync'
import { useI18n } from 'vue-i18n'
import { ledgerstatement, utils, user, apppowerrental, sdk } from 'src/npoolstore'

import chevrons from '../../assets/chevrons.svg'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  profit: MyGoodProfit
}

const props = defineProps<Props>()
const goodProfit = toRef(props, 'profit')

const short = ref(true)

const logined = user.useLocalUserStore()
const target = computed(() => sdk.appPowerRental.appPowerRental(goodProfit.value?.AppGoodID))
const coinUnit = computed(() => sdk.appPowerRental.mainCoinUnit(goodProfit.value?.AppGoodID) || '')
const techServiceFee = computed(() => sdk.appPowerRental.techniqueFeeRatio(goodProfit.value?.AppGoodID) / 100)
const deservedRatio = computed(() => 1 - techServiceFee.value)

const showProductPage = computed(() => sdk.appPowerRental.showProductPage(goodProfit.value?.AppGoodID))

const detail = ledgerstatement.useStatementStore()
const miningDetails = computed(() => detail.miningRewards(undefined, logined.loginedUserID).filter((el) => el.AppGoodID === goodProfit?.value?.AppGoodID))

const router = useRouter()
const onPurchaseClick = (_good: apppowerrental.AppPowerRental) => {
  void router.push({
    path: _good.ProductPage?.length ? _good.ProductPage : '/product/aleo',
    query: {
      appGoodID: _good.AppGoodID
    }
  })
}

const onExpandClick = () => {
  short.value = !short.value
}

interface ExportMiningReward {
  CreatedAt: string
  Units: string
  RewardAmount: string
  TechServiceFee: number
  NetRewards: number
  RewardAmountPerUnit: number
  CumulativeTotal: number
}

const exportMiningRewards = computed(() => {
  const rowMap = new Map<string, Array<ledgerstatement.MiningReward>>()
  const keys = [] as Array<string>
  miningDetails.value.forEach((el) => {
    const benefitDate = new Date(el.CreatedAt * 1000).toISOString()?.replace('T', ' ')?.replace('.000Z', ' UTC')?.split(' ')[0]
    if (!rowMap.get(benefitDate)) {
      keys.push(benefitDate)
      rowMap.set(benefitDate, [el])
    } else {
      rowMap.get(benefitDate)?.push(el)
    }
  })

  const rows = [] as Array<ExportMiningReward>
  let cumulativeTotal = 0

  keys.sort().forEach((key) => {
    let units = 0
    let netRewardAmount = 0
    const orderIDs = [] as Array<string>
    rowMap.get(key)?.forEach((el) => {
      const result = orderIDs.find((item) => item === el.OrderID)
      if (!result) {
        units += Number(el.Units)
        orderIDs.push(el.OrderID)
      }
      netRewardAmount += Number(el.RewardAmount)
      cumulativeTotal += Number(el.RewardAmount)
    })
    rows.push({
      CreatedAt: new Date(Number(rowMap.get(key)?.[0]?.CreatedAt) * 1000).toISOString()?.replace('T', ' ')?.replace('.000Z', ' UTC'),
      Units: `${units}`,
      RewardAmount: `${netRewardAmount / deservedRatio.value}`,
      TechServiceFee: (netRewardAmount / deservedRatio.value) * techServiceFee.value,
      NetRewards: netRewardAmount,
      RewardAmountPerUnit: netRewardAmount / units,
      CumulativeTotal: cumulativeTotal
    })
  })
  return rows
})

const onExportClick = () => {
  const columns = {
    CreatedAt: `${t('MSG_DATE_IN_TEMPLATE')}`,
    Units: `${t('MSG_UNITS_IN_TEMPLATE')}`,
    RewardAmount: `${t('MSG_REWARDS_IN_TEMPLATE')} (${coinUnit.value})`,
    TechServiceFee: `${t('MSG_TECH_SERVICE_FEE_IN_TEMPLATE')} (${coinUnit.value})`,
    NetRewards: `${t('NSG_NET_REWARDS_IN_TEMPLATE')} (${coinUnit.value})`,
    RewardAmountPerUnit: `${t('MSG_REWARDS_AMOUNT_PER_UNIT_IN_TEMPLATE')} (${coinUnit.value})`,
    CumulativeTotal: `${t('MSG_CUMULATIVE_TOTAL_IN_TEMPLATE')} (${coinUnit.value})`
  } as Record<string, string>
  const output = stringify(exportMiningRewards.value, {
    header: true,
    columns: columns
  })

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), output], { type: 'text/plain;charset=utf-8' })
  let name = t(sdk.appPowerRental.displayName(target?.value?.AppGoodID as string, 2))
  name = name.replace(/<.*?>/g, '')
  const filename = name + '-' + utils.formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}
</script>
<style lang='sass' scoped>
  .top-line-item .value
    padding-right: 5px
</style>
