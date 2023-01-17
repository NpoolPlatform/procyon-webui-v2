<template>
  <div class='content'>
    <h2>プレミア製品</h2>
    <div class='products'>
      <div class='product content-glass dark-glass project-aleo project-aleo-platinum'>
        <div class='product-heading'>
          <img class='icon' src='product/aleo/product-aleo.png'>
          <h3 class='product-title'>
            <span class='project-name'>Aleo</span>ファーストバッチマイニング：<span class='label-platinum'>プラチナ</span>
          </h3>
        </div>
        <h4 class='product-tagline'>
          革命的なゼロ知識証明技術を使用したレイヤー1スマートチェーン
        </h4>
        <span class='product-note'>プラチナプランは、メインネットマイニング報酬に加えてテストネット報酬を受け取ることができます</span>
        <button :class='["alt", purchasable("de420061-e878-4a8b-986a-805cadd59233") ? "" : "in-active"]' @click='onPurchaseClick'>
          {{ goodAction('de420061-e878-4a8b-986a-805cadd59233') }}
        </button>
      </div>
      <div class='product content-glass dark-glass project-spacemesh'>
        <div class='product-heading'>
          <img class='icon' src='product/spacemesh/product-spacemesh.svg'>
          <h3 class='product-title'>
            <span class='project-name'>Spacemesh</span>ファーストバッチマイニング
          </h3>
        </div>
        <h4 class='product-tagline'>
          世界で最も分散化された暗号資産をマイニング
        </h4>
        <button :class='["alt", purchasable("eaf9fc2d-63cd-450a-b098-5ef8f624df47") ? "" : "in-active"]'>
          {{ goodAction('eaf9fc2d-63cd-450a-b098-5ef8f624df47') }}
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

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/product/aleo' })
}

const good = useAdminAppGoodStore()
const goods = computed(() => good.AppGoods.AppGoods)
const recommends = computed(() => good.AppGoods.AppGoods.filter((el) => el?.RecommenderID))
console.log('recommends: ', recommends.value)

const goodAction = (id: string) => {
  const good = goods.value.find((el) => el.GoodID === id)
  if (!good) {
    return '売り切れ'
  }
  if (good.SaleEndAt < Math.floor(Date.now() / 1000)) {
    return '売り切れ'
  }
  return '購入'
}

const purchasable = (id: string) => {
  const good = goods.value.find((el) => el.GoodID === id)
  if (!good) {
    return false
  }
  if (good.SaleEndAt < Math.floor(Date.now() / 1000)) {
    return false
  }
  return true
}

</script>
