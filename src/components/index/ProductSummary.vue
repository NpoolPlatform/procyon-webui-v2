<template>
  <div class='content'>
    <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
    <div class='products'>
      <div
        v-for='good in visibleAppPowerRentals' :key='good.EntID'
        class='product content-glass dark-glass'
        :class='[sdk.appPowerRental.displayColor(good.AppGoodID, 0)]'
      >
        <div
          class='good-banner'
          :style='{"background-image": "url(" + good.Banner + ")"}'
        />
        <div class='product-heading'>
          <img class='icon' :src='good.CoinLogo'>
          <div>
            <template v-for='(name, index) in [sdk.appPowerRental.displayName(good.AppGoodID, 0)]' :key='index'>
              <div v-html='$t(name as string)' class='inner-container' />
            </template>
          </div>
        </div>
        <template v-for='(desc, idx) in [sdk.appPowerRental.description(good.AppGoodID, 0), sdk.appPowerRental.description(good.AppGoodID, 1)]' :key='idx'>
          <div v-html='$t(desc as string)' class='inner-container' />
        </template>
        <div class='product-button-box'>
          <button
            :class='[showProductPage(good) ? "" : "in-active"]'
            :disabled='!showProductPage(good)'
            @click='onPurchaseClick(good)'
          >
            {{ good.AppGoodName?.toLowerCase().includes('btc') ? $t('MSG_BTC_LEARN_MORE') : $t(getBtnMsg(good.AppGoodID)) }}
          </button>
          <button
            :class='["alt", sdk.appPowerRental.description(good.AppGoodID, 4).length ? "" : "in-active"]'
            @click='onLearnMoreClick($t(sdk.appPowerRental.description(good.AppGoodID, 4) as string))'
            :disabled='!sdk.appPowerRental.description(good.AppGoodID, 4)?.length'
          >
            {{ good.AppGoodName?.toLowerCase().includes('btc') ? $t('MSG_SIGN_UP_FOR_SEMINAR') : $t('MSG_LEARN_MORE_ON_OUR_BLOG') }}
          </button>
        </div>
      </div>
      <div class='hr' />
    </div>
  </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { sdk, apppowerrental } from 'src/npoolstore'

const appPowerRentals = computed(() => sdk.appPowerRental.appPowerRentals.value)
const visibleAppPowerRentals = computed(() => appPowerRentals.value?.filter((el) => el.Visible)?.sort((a, b) => a.DisplayIndex - b.DisplayIndex))

const showProductPage = computed(() => (good: apppowerrental.AppPowerRental) => sdk.appPowerRental.showProductPage(good.AppGoodID))

const router = useRouter()
const onPurchaseClick = (good: apppowerrental.AppPowerRental) => {
  void router.push({
    path: good?.ProductPage?.length ? good?.ProductPage : '/product/aleo',
    query: {
      appGoodID: good.AppGoodID
    }
  })
}

const onLearnMoreClick = (url: string) => {
  window.open(url, '_blank')
}

const getBtnMsg = computed(() => (appGoodID: string) => {
  const good = sdk.appPowerRental.appPowerRental(appGoodID)
  if (!good) {
    return 'MSG_SOLD_OUT'
  }
  const now = Math.floor(Date.now() / 1000)
  if (now > good?.SaleEndAt || Number(good?.GoodSpotQuantity) + Number(good?.AppGoodSpotQuantity) <= 0) {
    return 'MSG_SOLD_OUT'
  }
  if (now < good?.SaleStartAt) {
    return 'MSG_NOT_YET_AVAILABLE'
  }

  return 'MSG_PURCHASE'
})

</script>
<style lang='sass' scoped>
.inner-container
  width: 100%
.product-button-box
  align-self: flex-end
  width: 100%
</style>
