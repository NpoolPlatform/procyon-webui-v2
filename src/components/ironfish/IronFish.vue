<template>
  <IronProductPage
    :good-id='goodID'
    :purchase-amount='purchaseAmount'
    project-class='project-iron-fish'
    bg-img='product/iron/iron-fish-banner.jpg'
    :customize-info='true'
  >
    <template #product-info>
      <div class='three-section'>
        <h4>{{ $t('MSG_PRICE') }}:</h4>
        <span class='number'>{{ good.getPrice(goodID) }}</span>
        <span class='unit'>{{ PriceCoinName }} / {{ $t(target?.Unit) }}</span>
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
        <span class='number'>{{ target?.DurationDays }}</span>
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
        <span class='number'>{{ target?.ServiceStartAt === 0 ? 'TBD*' : good.getJSTDate(target?.ServiceStartAt, 'YYYY-MM-DD') }}</span>
        <br>
        <span class='unit'>{{ good.getJSTDate(target?.ServiceStartAt, 'HH:mm') }} {{ $t("MSG_JST") }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_IRON_FISH_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_IRON_FISH_ORDER_EFFECTIVE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section' v-if='good.haveSale(target)'>
        <h4>{{ $t("MSG_IRON_FISH_SALE_END_DATE") }}</h4>
        <span class='number'>{{ good.getSaleEndDate(target) }}</span>
        <br>
        <span class='unit'>{{ good.getSaleEndTime(target) }} {{ $t("MSG_JST") }}</span>
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
import { defineAsyncComponent, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import question from '../../assets/question.svg'
// import lightbulb from '../../assets/lightbulb.svg'
import { AppGood, NotifyType, useAdminAppCoinStore, useAdminAppGoodStore, useAdminCoinDescriptionStore, useAdminCurrencyStore } from 'npool-cli-v4'
import { getCurrencies, getDescriptions } from 'src/api/chain'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t, locale } = useI18n({ useScope: 'global' })

const IronProductPage = defineAsyncComponent(() => import('src/components/ironfish/IronProductPage.vue'))
const ProductDetailUS = defineAsyncComponent(() => import('src/components/ironfish/en-US/Detail.vue'))
const ProductDetailJP = defineAsyncComponent(() => import('src/components/ironfish/ja-JP/Detail.vue'))

interface Query {
  goodId: string;
  purchaseAmount: number;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const coin = useAdminAppCoinStore()

// Use CoinUnit to find GoodID from AppDefaultGood
const coinUnit = 'IRON'
const defaultGoodID = computed(() => coin.getGoodIDByCoinUnit(coinUnit))

const goodID = computed(() => query.value.goodId?.length ? query.value.goodId : defaultGoodID.value)
const purchaseAmount = computed(() => query.value.purchaseAmount)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodID.value) as AppGood)

const currency = useAdminCurrencyStore()

const description = useAdminCoinDescriptionStore()

const router = useRouter()
watch(goodID, () => {
  if (!goodID.value || goodID.value?.length === 0) {
    void router.push({ path: '/' })
  }
})

onMounted(() => {
  console.log('CoinUnit: ', coinUnit)

  if (goodID.value?.length > 0) {
    good.getAppGood({
      GoodID: goodID.value,
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD'),
          Message: t('MSG_GET_GOOD_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
    // TODO
    })
  }

  if (description.CoinDescriptions.CoinDescriptions.length === 0) {
    getDescriptions(0, 100)
  }

  if (currency.Currencies.Currencies.length === 0 || currency.expired()) {
    currency.$reset()
    getCurrencies(0, 10)
  }

  if (!goodID.value || goodID.value?.length === 0) {
    void router.push({ path: '/' })
  }
})

</script>

<style lang='sass' scoped>
</style>
