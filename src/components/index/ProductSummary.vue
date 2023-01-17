<template>
  <div class='content'>
    <h2>Premiere Products</h2>

    <div class='products'>
      <div
        class='product content-glass dark-glass project-aleo'
        v-for='_good in goods' :key='_good.ID'
      >
        <!-- <div class='product good-banner' :style='{"background-image": _good.Descriptions?.[0]?.length > 0 ? "url(" + _good.GoodBanner + ")" : ""}' /> -->
        <div class='product-heading'>
          <img class='icon' :src='_good.CoinLogo'>
          <h3 class='product-title'>
            <span v-html='_good?.Descriptions?.[0] ? t(_good?.Descriptions?.[0]) : ""' />
          </h3>
        </div>
        <h4 class='product-tagline'>
          {{ _good?.Descriptions?.[1] ? t(_good?.Descriptions?.[1]) : '' }}
        </h4>
        <span class='product-note'>
          {{ _good?.Descriptions?.[2] ? t(_good?.Descriptions?.[2]) : '' }}
        </span>
        <button class='alt' @click='onPurchaseClick' v-if='good.haveSale(_good)'>
          {{ t('MSG_PURCHASE') }}
        </button>
        <button class='alt in-active' @click='onPurchaseClick' disabled v-else>
          {{ t('MSG_SOLD_OUT') }}
        </button>
      </div>
    </div>

    <div class='hr' />
  </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAdminAppGoodStore } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/product/aleo' })
}

const good = useAdminAppGoodStore()
const goods = computed(() => good.AppGoods.AppGoods?.filter((el) => el.Visible))

// const goodBannerClass = computed(() => (goodBanner: string) => ({
//   'background-image': 'url(' + goodBanner + ')'
// }))
</script>

<style lang='sass' scoped>
.product .good-banner::before
  background: ''
</style>
