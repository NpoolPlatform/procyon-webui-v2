<template>
  <div class='content'>
    <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
    <div class='products'>
      <div
        v-for='_good in goods' :key='_good.EntID'
        class='product content-glass dark-glass'
        :class='[_good.DisplayColors?.[0] ? _good.DisplayColors?.[0]: ""]'
      >
        <div
          class='good-banner'
          :style='{"background-image": "url(" + _good.GoodBanner + ")"}'
        />
        <div class='product-heading'>
          <img class='icon' :src='_good.CoinLogo'>
          <template v-for='(title,index) in _good?.DisplayNames?.slice(0, 1)' :key='index'>
            <div v-html='t(title)' class='inner-container' />
          </template>
        </div>
        <template v-for='(desc,idx) in _good?.Descriptions?.slice(0, 2)' :key='idx'>
          <div v-html='t(desc)' class='inner-container' />
        </template>
        <div class='product-button-box'>
          <button
            :class='[showProductPage(_good) ? "in-active" : ""]'
            @click='onPurchaseClick(_good)'
            :disabled='showProductPage(_good)'
          >
            {{ $t(good.goodPurchaseBtnMsg(undefined, _good.EntID)) }}
          </button>
          <button
            :class='["alt", _good?.Descriptions?.[4]?.length > 0 ? "" : "in-active"]'
            @click='onLearnMoreClick($t(_good?.Descriptions?.[4]))'
            :disabled='_good?.Descriptions?.[4]?.length === 0'
          >
            {{ $t('MSG_LEARN_MORE_ON_OUR_BLOG') }}
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
import { appgood } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const showProductPage = computed(() => (_good: appgood.Good) => !_good.EnableProductPage || !good.canBuy(undefined, _good.EntID) || !good.spotQuantity(undefined, _good.EntID))

const router = useRouter()
const onPurchaseClick = (_good: appgood.Good) => {
  if (showProductPage.value(_good)) {
    return
  }
  void router.push({
    path: _good?.ProductPage?.length ? _good?.ProductPage : '/product/aleo',
    query: {
      appGoodID: _good.EntID
    }
  })
}

const good = appgood.useAppGoodStore()
const goods = computed(() => good.goods(undefined).filter((el) => el.Visible))

const onLearnMoreClick = (url: string) => {
  window.open(url, '_blank')
}

</script>
<style lang='sass' scoped>
.inner-container
  width: 100%
.product-button-box
  align-self: flex-end
</style>
