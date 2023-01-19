<template>
  <div class='content'>
    <h2>Premiere Products</h2>
    <div class='products'>
      <div
        class='product content-glass dark-glass'
        v-for='_good in goods' :key='_good.ID'
      >
        <div
          class='good-banner'
          :style='{"background-image": "url(" + _good.GoodBanner + ")"}'
        />
        <div class='product-heading'>
          <img class='icon' :src='_good.CoinLogo'>
          <div v-html='_good?.Descriptions?.[0] ? t(_good?.Descriptions?.[0]) : ""' />
        </div>
        <template v-for='(desc,idx) in _good?.Descriptions?.slice(1, _good.Descriptions?.length)' :key='idx'>
          <div v-html='desc? t(desc) : ""' />
        </template>
        <button class='alt' @click='onPurchaseClick' v-if='good.haveSale(_good)'>
          {{ t('MSG_PURCHASE') }}
        </button>
        <button class='alt in-active' @click='onPurchaseClick' disabled v-else>
          {{ t('MSG_SOLD_OUT') }}
        </button>
      </div>
      <div class='hr' />
    </div>
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

</script>
