<template>
  <div class='product'>
    <div class='product-heading'>
      <img class='icon' :src='coin.getCoinLogo(good.Main as Coin)'>
      <h3 class='product-title'>
        {{ good.Good.Good.Title }}
      </h3>
    </div>
    <h4 class='price'>
      <span>{{ goods.getGoodPrice(good) }}</span> {{ PriceCoinName }} / {{ good.Good.Good.Unit }}
    </h4>
    <div class='line'>
      <span class='label'>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</span>
      <span class='value'>*{{ good.Main?.Unit }} / {{ $t('MSG_DAY') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_SERVICE_PERIOD') }}:</span>
      <span class='value'>{{ good.Good.Good.DurationDays }} {{ $t('MSG_DAYS') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</span>
      <span class='value'>20%</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_MAINTENANCE_FEE') }}:</span>
      <span class='value'>$0.05 / {{ $t('MSG_DAY') }}</span>
    </div>

    <div class='line'>
      <span class='label'>{{ $t('MSG_ORDER_EFFECTIVE') }}:</span>
      <span class='value'>{{ formatTime(good.Good.Good.StartAt, true) }}</span>
    </div>
    <button class='alt' @click='onPurchaseClick'>
      {{ $t('MSG_PURCHASE') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef } from 'vue'
import { Good, useGoodStore, formatTime, useCoinStore, Coin, PriceCoinName } from 'npool-cli-v2'
import { useRouter } from 'vue-router'

interface Props {
  good: Good
}

const props = defineProps<Props>()
const good = toRef(props, 'good')

const goods = useGoodStore()
const coin = useCoinStore()

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({
    path: '/purchase',
    query: {
      goodId: good.value.Good.Good.ID
    }
  })
}

</script>
