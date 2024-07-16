<template>
  <ProductPage
    :app-good-i-d='(appGoodID as string)'
    :purchase-amount='purchaseAmount'
    project-class='project-spacemesh'
    bg-img='product/spacemesh/spacemesh-banner.jpg'
    :customize-info='false'
  >
    <template #product-detail>
      <div v-show='coinDescription'>
        <h3>{{ coinDescription ? $t(coinDescription?.Title) : '' }}</h3>
        <p v-html='coinDescription ? $t(coinDescription?.Message) : ""' />
      </div>
      <h3>
        <span v-html='$t("MSG_WHY_TITLE")' />
      </h3>
      <p v-html='$t("MSG_WHY_CONTENT")' />
      <div v-show='targetCoin?.Specs'>
        <h3>{{ $t('MSG_OFFICIAL_SPECS', { COIN_NAME: target?.CoinName }) }}</h3>
        <p>
          <img class='content-image' :src='targetCoin?.Specs'>
        </p>
      </div>
      <p>
        <a :href='targetCoin?.HomePage'>
          {{ $t('MSG_HOMEPAGE_WITH_RIGHT_ARROW', { COIN_NAME: target?.CoinName }) }}
        </a>
      </p>
    </template>
    <template #sidebar>
      <div id='project-links' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_PROJECT_LINKS') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href='https://spacemesh.io/' target='_blank'><img class='link-icon' src='font-awesome/homepage.svg'>
              <span>{{ $t('MSG_SPACEMESH_HOMEPAGE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://twitter.com/teamspacemesh' target='_blank'><img class='link-icon' src='font-awesome/twitter.svg'>
              <span>{{ $t('MSG_TWITTER') }}</span>
            </a>
          </li>
          <li>
            <a href='https://medium.com/spacemesh' target='_blank'><img class='link-icon' src='font-awesome/medium.svg'>
              <span>{{ $t('MSG_MEDIUM') }}</span>
            </a>
          </li>
          <li>
            <a href='https://www.youtube.com/channel/UCn-0T-qeP_SmKoiyvX49oVg' target='_blank'><img class='link-icon' src='font-awesome/youtube.svg'>
              <span>{{ $t('MSG_YOUTUBE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://discord.com/invite/yVhQ7rC' target='_blank'><img class='link-icon' src='font-awesome/discord.svg'>
              <span>{{ $t('MSG_DISCORD') }}</span>
            </a>
          </li>
          <li>
            <a href='https://github.com/spacemeshos' target='_blank'><img class='link-icon' src='font-awesome/github.svg'>
              <span>{{ $t('MSG_GITHUB') }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div id='help' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_HELP_AND_FAQ') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href=''><img class='link-icon' src='font-awesome/lightbulb.svg'>
              <span>{{ $t('MSG_MINING_BASICS') }}</span>
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
import { appcoin, appcoindescription, coincurrency, sdk } from 'src/npoolstore'
import { getCoins, getCurrencies, getDescriptions } from 'src/api/chain'

interface Query {
  appGoodID: string
  purchaseAmount: number
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const purchaseAmount = computed(() => query.value.purchaseAmount)

const target = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value as string))

// Use CoinUnit to find AppGoodID from AppDefaultGood
const coinUnit = 'SMH'
const appGoodID = computed(() => query.value?.appGoodID || coin.defaultGoodID(undefined, coinUnit))
const _appPowerRental = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value as string))

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
const targetCoin = computed(() => coin.coin(undefined, target.value?.CoinTypeID as string))

const description = appcoindescription.useCoinDescriptionStore()
const coinDescription = computed(() => description.coinUsedForDescription(
  undefined,
  target.value?.CoinTypeID as string,
  appcoindescription.CoinDescriptionUsedFor.ProductPage))

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))
const router = useRouter()

const currency = coincurrency.useCurrencyStore()

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
