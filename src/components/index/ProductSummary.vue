<template>
  <div class='content'>
    <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
    <div class='products'>
      <div
        v-for='_good in goods' :key='_good.ID'
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
            <div v-html='t(title)' class='product-heading-container' />
          </template>
        </div>
        <template v-for='(desc,idx) in _good?.Descriptions?.slice(0, 2)' :key='idx'>
          <div v-html='t(desc)' class='product-heading-container' />
        </template>
        <button
          :class='["alt", getStatus(_good) ? "in-active" : ""]'
          @click='onPurchaseClick(_good)'
          :disabled='getStatus(_good)'
        >
          {{ $t(good.getGoodBtnMsg(_good)) }}
        </button>
      </div>
      <div class='hr' />
    </div>
  </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { AppGood, useAdminAppGoodStore } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const getStatus = computed(() => (_good: AppGood) => !_good.EnableProductPage || !good.haveSale(_good) || !good.haveStock(_good))

const router = useRouter()
const onPurchaseClick = (_good: AppGood) => {
  console.log('EnableProductPage: ', _good.EnableProductPage)
  console.log('ProductPage: ', _good.ProductPage)
  if (getStatus.value(_good)) {
    return
  }

  if (_good.ProductPage?.length === 0 || !_good.ProductPage) {
    void router.push({
      path: '/product/aleo',
      query: {
        goodId: _good.GoodID
      }
    })
    return
  }

  void router.push({
    path: _good?.ProductPage,
    query: {
      goodId: _good.GoodID
    }
  })
}

const good = useAdminAppGoodStore()
const goods = computed(() => good.AppGoods.AppGoods?.filter((el) => el.Visible))
</script>
<style lang='sass' scoped>
.product-heading-container
  width: 100%
</style>
