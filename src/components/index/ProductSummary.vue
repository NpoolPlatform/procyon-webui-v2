<template>
  <div class='content'>
    <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
    <div class='products'>
      <div
        v-for='good in visibleAppPowerRentals' :key='good.EntID'
        class='product content-glass dark-glass'
        :class='[sdk.displayColor(good.AppGoodID, 0)?.length ? sdk.displayColor(good.AppGoodID, 0): ""]'
      >
        <div
          class='good-banner'
          :style='{"background-image": "url(" + good.Banner + ")"}'
        />
        <div class='product-heading'>
          <img class='icon' :src='good.CoinLogo'>
          <div v-if='good?.DisplayNames?.length'>
            <template v-for='(name, index) in [sdk.displayName(good.AppGoodID, 0), sdk.displayName(good.AppGoodID, 1)]' :key='index'>
              <div v-html='t(name as string)' class='inner-container' />
            </template>
          </div>
          <div v-else>
            {{ good.GoodName }}
          </div>
        </div>
        <template v-for='(desc, idx) in [sdk.description(good.AppGoodID, 0), sdk.description(good.AppGoodID, 1), sdk.description(good.AppGoodID, 2)]' :key='idx'>
          <div v-html='t(desc as string)' class='inner-container' />
        </template>
        <div class='product-button-box'>
          <button
            :class='[showProductPage(good) ? "in-active" : ""]'
            @click='onPurchaseClick(good)'
            :disabled='showProductPage(good)'
          >
            {{ good.GoodName?.toLowerCase().includes('btc') ? $t('MSG_BTC_LEARN_MORE') : $t(getBtnMsg(good.AppGoodID)) }}
          </button>
          <button
            :class='["alt", sdk.description(good.AppGoodID, 4).length ? "" : "in-active"]'
            @click='onLearnMoreClick($t(sdk.description(good.AppGoodID, 4) as string))'
            :disabled='!sdk.description(good.AppGoodID, 4)?.length'
          >
            {{ good.GoodName?.toLowerCase().includes('btc') ? $t('MSG_SIGN_UP_FOR_SEMINAR') : $t('MSG_LEARN_MORE_ON_OUR_BLOG') }}
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
import { useI18n } from 'vue-i18n'
import { sdk, apppowerrental } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const appPowerRentals = computed(() => sdk.appPowerRentals.value)
const visibleAppPowerRentals = computed(() => appPowerRentals.value?.filter((el) => el.Visible))

const showProductPage = computed(() => (good: apppowerrental.AppPowerRental) => !good.EnableProductPage || !sdk.canBuy(good.AppGoodID) || !sdk.spotQuantity(good.AppGoodID))

const router = useRouter()
const onPurchaseClick = (good: apppowerrental.AppPowerRental) => {
  if (showProductPage.value(good)) {
    return
  }
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
  const good = sdk.appPowerRental(appGoodID)
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
