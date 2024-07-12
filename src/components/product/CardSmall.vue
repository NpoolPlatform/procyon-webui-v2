<template>
  <div class='product'>
    <div class='product-heading'>
      <img class='icon' :src='good.CoinLogo'>
      <h3 class='product-title'>
        {{ good.GoodName }}
      </h3>
    </div>
    <h4 class='price'>
      <span>{{ sdk.priceString(good.AppGoodID) }}</span>
      {{ constant.PriceCoinName }} / {{ good.QuantityUnitAmount + $t(good.QuantityUnit) }}
    </h4>
    <div class='line'>
      <span class='label'>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</span>
      <span class='value'>*{{ good.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
      <span class='value'>{{ good.DurationDays }} {{ $t('MSG_DAYS') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
      <span class='value'>20%</span>
    </div>

    <!-- div class='line'>
      <span class='label'>{{ $t('MSG_MAINTENANCE_FEE') }}:</span>
      <span class='value'>* / {{ $t('MSG_DAY') }}</span>
    </div -->

    <div class='line'>
      <span class='label'>{{ $t('MSG_ORDER_EFFECTIVE') }}:</span>
      <span class='value'>{{ utils.formatTime(good.ServiceStartAt, undefined) }}</span>
    </div>
    <button class='alt' @click='onPurchaseClick'>
      {{ $t('MSG_PURCHASE') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appcoin, utils, constant, apppowerrental, sdk } from 'src/npoolstore'
import { getCoins } from 'src/api/chain'

interface Props {
  good: apppowerrental.AppPowerRental
}

const props = defineProps<Props>()
const good = toRef(props, 'good')

const coin = appcoin.useAppCoinStore()
const productInfo = computed(() => coin.productPage(undefined, good.value?.CoinTypeID))

const router = useRouter()
const onPurchaseClick = () => {
  let target = '/purchase'
  if (productInfo.value?.length) {
    target = productInfo.value
  }

  void router.push({
    path: target,
    query: {
      appGoodID: good.value.AppGoodID
    }
  })
}

onMounted(() => {
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }
})

</script>
