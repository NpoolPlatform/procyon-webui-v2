<template>
  <div :class='[ "product-container content-glass project", projectClass ]'>
    <div class='product-title-section project-title-section' :style='{"background-image": "url(" + bgImg + ")"}'>
      <div class='product-title-container'>
        <div class='product-page-icon'>
          <img :src='good?.Main?.Logo'>
        </div>
        <h1>{{ good?.Main?.Name }} {{ $t('MSG_MINING') }}</h1>
      </div>
    </div>
    <div class='info'>
      <h3 class='form-title'>
        {{ $t('MSG_PRODUCT_DETAILS') }}
      </h3>
      <div class='info-flex'>
        <div class='three-section'>
          <h4>{{ $t('MSG_PRICE') }}:</h4>
          <span class='number'>{{ good?.Good?.Good?.Price }}</span>
          <span class='unit'>{{ PriceCoinName }}</span>
          <div class='tooltip'>
            <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
            <p class='tooltip-text'>
              {{ $t('MSG_PRICE_TIP') }}
            </p>
          </div>
        </div>
        <div class='three-section'>
          <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
          <span class='number'>*</span>
          <span class='unit'>{{ good?.Main?.Unit }} / {{ $t('MSG_DAY') }}</span>
          <div class='tooltip'>
            <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
            <p class='tooltip-text'>
              {{ $t('MSG_DAILY_REWARD_TIP') }}
            </p>
          </div>
        </div>
        <div class='three-section'>
          <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
          <span class='number'>{{ good?.Good?.Good?.DurationDays }}</span>
          <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          <div class='tooltip'>
            <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
            <p class='tooltip-text'>
              {{ $t('MSG_SERVICE_PERIOD_TIP') }}
            </p>
          </div>
        </div>
        <div class='three-section'>
          <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
          <span class='number'>20</span>
          <span class='unit'>%</span>
          <div class='tooltip'>
            <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
            <p class='tooltip-text'>
              {{ $t('MSG_TECHNIQUE_SERVICE_FEE_TIP') }}
            </p>
          </div>
        </div>
        <div class='three-section'>
          <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
          <span class='number'>{{ true ? 'TBD*' : formatTime(good?.Good?.Good?.StartAt, true) }}</span>
          <div class='tooltip'>
            <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
            <p class='tooltip-text'>
              {{ $t('MSG_ORDER_EFFECTIVE_TIP') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class='product-sidebar'>
      <div id='product-form' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_MINING_PURCHASE') }}
        </h3>
        <div class='warning'>
          <img :src='lightbulb'>
          <span>{{ $t(purchaseCaption) }}</span>
        </div>
        <div class='hr' />
        <button @click='onLearnMoreAndPurchaseClick'>
          {{ $t('MSG_LEARN_MORE_AND_PURCHASE') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  formatTime,
  PriceCoinName,
  useCoinStore,
  Good
} from 'npool-cli-v2'
import { defineProps, toRef, computed } from 'vue'
import { useRouter } from 'vue-router'

import lightbulb from '../../assets/lightbulb.svg'
import question from '../../assets/question.svg'

interface Props {
  good: Good
  projectClass: string
  bgImg: string
  purchaseCaption: string
}

const props = defineProps<Props>()
const projectClass = toRef(props, 'projectClass')
const bgImg = toRef(props, 'bgImg')
const good = toRef(props, 'good')
const purchaseCaption = toRef(props, 'purchaseCaption')

const coin = useCoinStore()
const productInfo = computed(() => coin.getCoinProductInfoByCoin(good.value?.Main?.ID as string))

const router = useRouter()

const onLearnMoreAndPurchaseClick = () => {
  let target = '/purchase'
  if (productInfo.value?.ProductPage?.length) {
    target = productInfo.value.ProductPage
  }

  void router.push({
    path: target,
    query: {
      goodId: good.value.Good.Good.ID
    }
  })
}

</script>

<style lang='sass' scoped>
</style>
