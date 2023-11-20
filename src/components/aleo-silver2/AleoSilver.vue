<template>
  <ProductPage
    :app-good-i-d='(appGoodID as string)'
    :purchase-amount='purchaseAmount'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    :customize-info='true'
  >
    <template #product-info>
      <div class='three-section'>
        <h4>{{ $t('MSG_PRICE') }}:</h4>
        <span class='number'>{{ utils.getLocaleString(good.priceString(undefined, appGoodID as string)) }}</span>
        <span class='unit'>{{ constant.PriceCoinName }} / {{ target?.Unit ? $t(target?.Unit) : '' }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_PRICE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
        <span class='number'>*</span>
        <span class='unit'>{{ target?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_DAILY_REWARD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
        <span class='number'>{{ target?.DurationDays }}</span>
        <span class='unit'>{{ $t('MSG_DAYS') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_SERVICE_PERIOD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
        <span class='number'>20</span>
        <span class='unit'>%</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_TECHNIQUE_SERVICE_FEE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
        <span v-if='target?.ServiceStartAt === 0 || target?.StartMode === appgood.GoodStartMode.GoodStartModeTBD' class='number'>{{ $t("MSG_TBA") }}</span>
        <div v-else>
          <span class='number'>{{ utils.formatTime(target?.ServiceStartAt as number, 'YYYY-MM-DD') }}</span>
          <br>
          <span class='unit'>{{ utils.formatTime(target?.ServiceStartAt as number, 'HH:mm:ss') }} {{ $t("MSG_JST") }}</span>
        </div>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_ORDER_EFFECTIVE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section' v-if='good.canBuy(undefined, target?.ID as string)'>
        <h4>{{ $t("MSG_SALE_END_DATE") }}</h4>
        <span class='number'>{{ good.saleEndDate(undefined, target?.ID as string, 'YYYY-MM-DD') }}</span>
        <br>
        <span class='unit'>{{ good.saleEndTime(undefined, target?.ID as string, 'HH:mm:ss') }} {{ $t("MSG_JST") }}</span>
        <div class='tooltip'>
          <img class='more-info' src='font-awesome/question.svg'><span>{{ $t('MSG_ALEO_SILVER_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ALEO_SILVER_SALE_END_DATE_TIP') }}
          </p>
        </div>
      </div>
      <div class='hr' />
    </template>
    <template #product-detail>
      <div v-if='locale === "en-US"'>
        <ProductDetailUS />
      </div>
      <div v-else>
        <ProductDetailJP />
      </div>
    </template>
    <template #sidebar>
      <div id='project-links' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_PROJECT_LINKS') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href='https://www.aleo.org/' target='_blank'><img class='link-icon' src='font-awesome/homepage.svg'>
              <span>{{ $t('MSG_ALEO_HOMEPAGE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://twitter.com/AleoHQ' target='_blank'><img class='link-icon' src='font-awesome/twitter.svg'>
              <span>{{ $t('MSG_TWITTER') }}</span>
            </a>
          </li>
          <li>
            <a href='https://www.youtube.com/channel/UCS_HKT2heOC_q88YQLiJt0g' target='_blank'><img class='link-icon' src='font-awesome/youtube.svg'>
              <span>{{ $t('MSG_YOUTUBE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://discord.com/invite/aleohq' target='_blank'><img class='link-icon' src='font-awesome/discord.svg'>
              <span>{{ $t('MSG_DISCORD') }}</span>
            </a>
          </li>
          <li>
            <a href='https://github.com/AleoHQ' target='_blank'><img class='link-icon' src='font-awesome/github.svg'>
              <span>{{ $t('MSG_GITHUB') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </template>
  </ProductPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCoins, getCurrencies, getDescriptions } from 'src/api/chain'
import { appgood, notify, appcoin, appcoindescription, coincurrency, utils, constant } from 'src/npoolstore'

import question from '../../assets/question.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale } = useI18n({ useScope: 'global' })

const ProductPage = defineAsyncComponent(() => import('src/components/aleo-silver2/ProductPage.vue'))
const ProductDetailUS = defineAsyncComponent(() => import('src/components/aleo-silver2/en-US/Detail.vue'))
const ProductDetailJP = defineAsyncComponent(() => import('src/components/aleo-silver2/ja-JP/Detail.vue'))

interface Query {
  appGoodID: string
  purchaseAmount: number
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const getGood = () => {
  if (_good.value) {
    return
  }
  if (!appGoodID.value) {
    return
  }
  good.getAppGood({
    ID: appGoodID.value,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOD',
        Message: 'MSG_GET_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    if (!_good.value) {
      // void router.push({ path: '/' })
    }
  })
}

const coin = appcoin.useAppCoinStore()
// Use CoinUnit to find AppGoodID from AppDefaultGood
const coinUnit = 'ALEO'
const purchaseAmount = computed(() => query.value.purchaseAmount)

const good = appgood.useAppGoodStore()
const appGoodID = computed(() => query.value?.appGoodID || coin.defaultGoodID(undefined, coinUnit))
const target = computed(() => good.good(undefined, appGoodID.value as string))
const _good = computed(() => good.good(undefined, appGoodID.value as string))

const currency = coincurrency.useCurrencyStore()
const description = appcoindescription.useCoinDescriptionStore()

onMounted(() => {
  if (!coin.coins(undefined).length) {
    getCoins(0, 100, () => {
      getGood()
    })
  } else {
    getGood()
  }
  if (!description.descriptions(undefined)?.length) {
    getDescriptions(0, 100)
  }
  if (!currency.currencies.length) {
    getCurrencies(0, 100)
  }
})
</script>

<style lang='sass' scoped>
</style>
