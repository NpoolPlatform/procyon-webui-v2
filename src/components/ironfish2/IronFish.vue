<template>
  <IronProductPage
    :app-good-i-d='(appGoodID as string)'
    :purchase-amount='purchaseAmount'
    project-class='project-iron-fish'
    bg-img='product/iron/iron-fish-banner.jpg'
    :customize-info='true'
  >
    <template #product-info>
      <div class='three-section'>
        <h4>{{ $t('MSG_PRICE') }}:</h4>
        <span class='number'>{{ utils.getLocaleString(good.priceString(undefined, appGoodID as string)) }}</span>
        <span class='unit'>{{ constant.PriceCoinName }} / {{ target?.Unit ? $t(target?.Unit) : '' }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_PRICE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
        <span class='number'>*</span>
        <span class='unit'>{{ target?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_DAILY_REWARD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
        <span class='number'>{{ utils.getLocaleString(target?.DurationDays as number) }}</span>
        <span class='unit'>{{ $t('MSG_DAYS') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_SERVICE_PERIOD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
        <span class='number'>20</span>
        <span class='unit'>%</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_TECHNIQUE_SERVICE_FEE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
        <span class='number'>{{ target?.ServiceStartAt === 0 ? 'TBD*' : utils.formatTime(target?.ServiceStartAt as number, 'YYYY-MM-DD', 9) }}</span>
        <br>
        <!-- <span class='unit'>{{ good.getJSTDate(target?.ServiceStartAt, 'HH:mm') }} {{ $t("MSG_JST") }}</span> -->
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_ORDER_EFFECTIVE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section' v-if='good.canBuy(undefined, target?.ID as string)'>
        <h4>{{ $t("MSG_IRON_FISH_SALE_END_DATE") }}</h4>
        <span class='number'>{{ good.saleEndDate(undefined, target?.ID as string) }}</span>
        <br>
        <span class='unit'>{{ good.saleEndDate(undefined, target?.ID as string) }} {{ $t("MSG_JST") }}</span>
        <div class='tooltip'>
          <img class='more-info' src='font-awesome/question.svg'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_SALE_END_TIP') }}
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
          <li><a href='https://www.ironfish.network/' target='_blank'><img class='link-icon' src='font-awesome/homepage.svg'><span>{{ $t('MSG_IRON_FISH_HOMEPAGE') }}</span></a></li>
          <li><a href='https://twitter.com/ironfishcrypto' target='_blank'><img class='link-icon' src='font-awesome/twitter.svg'><span>{{ $t('MSG_TWITTER') }}</span></a></li>
          <li><a href='https://t.me/ironfishcryptochat' target='_blank'><img class='link-icon' src='font-awesome/telegram.svg'><span>{{ $t('MSG_TELEGRAM') }}</span></a></li>
          <li><a href='https://discord.ironfish.network/' target='_blank'><img class='link-icon' src='font-awesome/discord.svg'><span>{{ $t('MSG_DISCORD') }}</span></a></li>
          <li><a href='https://github.com/iron-fish' target='_blank'><img class='link-icon' src='font-awesome/github.svg'><span>{{ $t('MSG_GITHUB') }}</span></a></li>
        </ul>
      </div>
    </template>
  </IronProductPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCoins, getCurrencies, getDescriptions } from 'src/api/chain'
import { constant, appgood, appcoin, notify, coincurrency, appcoindescription, utils } from 'src/npoolstore'

import question from '../../assets/question.svg'
// import lightbulb from '../../assets/lightbulb.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale } = useI18n({ useScope: 'global' })

const IronProductPage = defineAsyncComponent(() => import('src/components/ironfish2/IronProductPage.vue'))
const ProductDetailUS = defineAsyncComponent(() => import('src/components/ironfish2/en-US/Detail.vue'))
const ProductDetailJP = defineAsyncComponent(() => import('src/components/ironfish2/ja-JP/Detail.vue'))

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
    void router.push({ path: '/' })
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
      void router.push({ path: '/' })
    }
  })
}

const coin = appcoin.useAppCoinStore()
// Use CoinUnit to find AppGoodID from AppDefaultGood
const coinUnit = 'IRON'
const purchaseAmount = computed(() => query.value.purchaseAmount)

const good = appgood.useAppGoodStore()
const appGoodID = computed(() => query.value?.appGoodID || coin.defaultGoodID(undefined, coinUnit))
const target = computed(() => good.good(undefined, appGoodID.value as string))
const _good = computed(() => good.good(undefined, appGoodID.value as string))

const currency = coincurrency.useCurrencyStore()
const description = appcoindescription.useCoinDescriptionStore()

const router = useRouter()

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
