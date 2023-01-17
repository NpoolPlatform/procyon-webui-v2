<template>
  <div class='content'>
    <h2>Premiere Products</h2>

    <div class='products'>
      <div
        class='product content-glass dark-glass project-aleo project-aleo-platinum'
        v-for='_good in goods' :key='_good.ID'
      >
        <div class='product-heading'>
          <img class='icon' :src='_good.CoinLogo'>
          <h3 class='product-title'>
            {{ _good?.Descriptions?.[0] ? t(_good?.Descriptions?.[0]) : '' }}
            <!-- <span class='project-name'>Aleo </span>First Batch Mining: <span class='label-platinum'>Platinum</span> -->
          </h3>
        </div>
        <h4 class='product-tagline'>
          <!-- A revolutionary Zero Knowledge-powered Layer 1 smartchain -->
          {{ _good?.Descriptions?.[1] ? t(_good?.Descriptions?.[1]) : '' }}
        </h4>
        <span class='product-note'>
          <!-- Aleo Mining Platinum let's you receive FULL testnet incentive rewards! -->
          {{ _good?.Descriptions?.[2] ? t(_good?.Descriptions?.[2]) : '' }}
        </span>
        <div v-if='good.haveSale(_good)'>
          <button class='alt' @click='onPurchaseClick'>
            {{ t('MSG_PURCHASE') }}
          </button>
        </div>
        <div v-else>
          <button class='alt in-active' @click='onPurchaseClick' disabled>
            {{ t('MSG_SOLD_OUT') }}
          </button>
        </div>
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
</script>
