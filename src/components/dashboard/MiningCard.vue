<template>
  <div class='mining-summary content-glass'>
    <div class='mining-heading'>
      <div class='product-page-icon'>
        <img :src='goodProfit?.CoinLogo'>
      </div>
      <h3 class='mining-title'>
        <div v-html='target?.DisplayNames?.[2]? $t(target?.DisplayNames?.[2]) : goodProfit.GoodName' />
      </h3>
    </div>
    <div class='top-line-summary'>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_EARNINGS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : parseFloat(goodProfit?.TotalInComing?.toFixed(4)) }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_LAST_24_HOURS') }}: </span>
        <span class='value'>{{ goodProfit?.CoinPreSale ? '*' : parseFloat(goodProfit?.Last24HoursInComing?.toFixed(4)) }}</span>
        <span class='sub-value'> {{ goodProfit?.CoinUnit }}</span>
      </div>
      <div class='top-line-item'>
        <span class='label'>{{ $t('MSG_CAPACITY') }}: </span>
        <span class='value'>{{ goodProfit?.Units }}</span>
        <span class='sub-value'>{{ goodProfit ? $t(goodProfit?.GoodUnit) : '' }}</span>
      </div>
    </div>
    <q-slide-transition>
      <div class='detailed-summary' v-show='!short'>
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_OUTPUT') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : goodProfit.Last30DaysInComing / 30 }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <div class='line'>
          <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
          <span class='value'>
            {{ goodProfit?.GoodServicePeriodDays }}
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </span>
        </div>
        <div class='line'>
          <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : parseFloat((goodProfit.Last24HoursInComing * 0.2)?.toFixed(4)) }}
            <span class='unit'>{{ goodProfit?.CoinUnit }} (20%)</span>
          </span>
        </div>
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_30_DAYS_AVERAGE_NET_OUTPUT') }}:</span>
          <span class='value'>
            {{ goodProfit?.CoinPreSale ? '*' : goodProfit.Last30DaysInComing / 30 * 0.8 }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <!-- <div class='line'>
          <span class='label'>{{ $t('MSG_NETWORK_DAILY_OUTPUT') }}:</span>
          <span class='value'>
            {{ '*' }}
            <span class='unit'>{{ goodProfit?.CoinUnit }}</span>
          </span>
        </div> -->
        <div class='line' v-if='goodProfit.GoodID === "de420061-e878-4a8b-986a-805cadd59233"'>
          <span class='label'>{{ $t('MSG_PROVER_INCENTIVE') }}:</span>
          <span class='value'>
            {{ goodProfit.TotalEstimatedDailyReward === 0 ? '*' : goodProfit.TotalEstimatedDailyReward }}
            <span class='unit'>{{ $t('MSG_CREDITS') }}</span></span>
        </div>
        <div class='warning' v-if='target?.Descriptions?.[3] && target?.Descriptions?.[3]?.length > 0'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t(target?.Descriptions?.[3])' />
        </div>
      </div>
    </q-slide-transition>
    <div class='buttons'>
      <button :class='[ "alt show-more", short ? "" : "open" ]' @click='onExpandClick'>
        <img :src='chevrons'>
      </button>
      <button class='alt' @click='onExportClick()' :disabled='exportMiningRewards?.length === 0'>
        {{ $t('MSG_EXPORT_DAILY_OUTPUT_CSV') }}
      </button>
      <button
        :class='["alt", getStatus(target as AppGood) ? "in-active" : ""]'
        :disabled='getStatus(target as AppGood)'
        @click='onPurchaseClick(target as AppGood)'
      >
        {{ $t('MSG_PURCHASE_CAPACITY') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import saveAs from 'file-saver'
import { useAdminAppGoodStore, useFrontendDetailStore, formatTime, MiningReward, AppGood } from 'npool-cli-v4'
import { MyGoodProfit } from 'src/localstore/ledger/types'
import { defineProps, toRef, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stringify } from 'csv-stringify/sync'
import { useI18n } from 'vue-i18n'

import chevrons from '../../assets/chevrons.svg'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  profit: MyGoodProfit;
}

const props = defineProps<Props>()
const goodProfit = toRef(props, 'profit')

const short = ref(true)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodProfit.value?.GoodID))
const coinUnit = computed(() => good.getGoodByID(goodProfit.value?.GoodID)?.CoinUnit as string)
const techServiceFee = computed(() => Number(target?.value?.TechnicalFeeRatio) / 100)
const deservedRatio = computed(() => 1 - techServiceFee.value)

const getStatus = computed(() => (_good: AppGood) => !_good.EnableProductPage || !good.haveSale(_good) || !good.haveStock(_good))

const detail = useFrontendDetailStore()
const miningDetails = computed(() => detail.MiningRewards.MiningRewards.filter((el) => el.GoodID === goodProfit?.value?.GoodID))

const router = useRouter()
const onPurchaseClick = (_good: AppGood) => {
  if (_good.ProductPage?.length === 0 || !_good.ProductPage) {
    void router.push({
      path: '/product/aleo',
      query: {
        goodId: _good.GoodID
      }
    })
    return
  }
  void router.push({
    path: _good?.ProductPage,
    query: {
      goodId: _good.GoodID
    }
  })
}

const onExpandClick = () => {
  short.value = !short.value
}

interface ExportMiningReward {
  CreatedAt: string;
  Units: string;
  RewardAmount: string;
  TechServiceFee: number;
  NetRewards: number;
  RewardAmountPerUnit: number;
  CumulativeTotal: number;
}

const exportMiningRewards = computed(() => {
  const rowMap = new Map<string, Array<MiningReward>>()
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
    const units = Number(goodProfit?.value?.Units)
    let netRewardAmount = 0
    rowMap.get(key)?.forEach((el) => {
      netRewardAmount += Number(el.RewardAmount)
      cumulativeTotal += Number(el.RewardAmount) / deservedRatio.value
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

  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
  const name = target?.value?.DisplayNames?.[2] ? t(target?.value?.DisplayNames?.[2]) : goodProfit.value?.GoodName
  const filename = name + '-' + formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}
</script>
<style lang='sass' scoped>
  .top-line-item .value
    padding-right: 5px
</style>
