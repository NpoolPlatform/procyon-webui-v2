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
        <span class='number'>{{ utils.getLocaleString(sdk.appPowerRental.unitPriceFloat(appGoodID as string)) }}</span>
        <span class='unit'>{{ constant.PriceCoinName }}</span>
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
        <span class='unit'>{{ target?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_DAILY_REWARD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
        <span class='number'>{{ utils.getLocaleString(target?.DurationDays?.toString() as string) }}</span>
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
        <span class='number'>{{ true ? 'TBD*' : utils.formatTime(target?.ServiceStartAt as number, 'YYYY/MM/DD') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ORDER_EFFECTIVE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section' v-if='sdk.appPowerRental.canBuy(target?.AppGoodID as string)'>
        <h4>{{ $t("MSG_SALE_END_DATE") }}</h4>
        <span class='number'>{{ sdk.appPowerRental.saleEndDate(target?.AppGoodID as string) }}</span>
        <br>
        <span class='unit'>{{ sdk.appPowerRental.saleEndTime(target?.AppGoodID as string) }} {{ $t("MSG_JST") }}</span>
        <div class='tooltip'>
          <img class='more-info' src='font-awesome/question.svg'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_SALE_END_DATE_TIP') }}
          </p>
        </div>
      </div>
      <div class='hr' />
    </template>
    <template #product-detail>
      <div v-if='__locale === "en-US"'>
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
import { useRoute, useRouter } from 'vue-router'
import { appcoin, appcoindescription, coincurrency, utils, constant, _locale, sdk } from 'src/npoolstore'
import { getCoins, getCurrencies, getDescriptions } from 'src/api/chain'

import question from '../../assets/question.svg'
// import lightbulb from '../../assets/lightbulb.svg'

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))
const ProductDetailUS = defineAsyncComponent(() => import('src/components/product/en-US/Detail.vue'))
const ProductDetailJP = defineAsyncComponent(() => import('src/components/product/ja-JP/Detail.vue'))

interface Query {
  appGoodID: string
  purchaseAmount: number
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const locale = _locale.useLocaleStore()
const __locale = computed(() => locale.locale())

const getAppPowerRental = () => {
  if (_appPowerRental.value) {
    return
  }
  if (!appGoodID.value) {
    void router.push({ path: '/' })
    return
  }
  sdk.appPowerRental.getAppPowerRental(appGoodID.value, () => {
    if (!_appPowerRental.value) {
      void router.push({ path: '/' })
    }
  })
}

const coin = appcoin.useAppCoinStore()
// Use CoinUnit to find AppGoodID from AppCoin
const coinUnit = 'ALEO'
const purchaseAmount = computed(() => query.value.purchaseAmount)

const appGoodID = computed(() => query.value?.appGoodID || coin.defaultGoodID(undefined, coinUnit))
const target = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value as string))
const _appPowerRental = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value as string))

const currency = coincurrency.useCurrencyStore()
const description = appcoindescription.useCoinDescriptionStore()

const router = useRouter()

onMounted(() => {
  if (!coin.coins(undefined).length) {
    getCoins(0, 100, () => {
      getAppPowerRental()
    })
  } else {
    getAppPowerRental()
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
