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
        <button class='alt' @click='onPurchaseClick'>
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
        <button class='alt in-active'>
          {{ goodAction('eaf9fc2d-63cd-450a-b098-5ef8f624df47') }}
        </button>
      </div>
    </div>
    <div class='hr' />
  </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotifyType, useAdminAppGoodStore, AppGood } from 'npool-cli-v4'

const router = useRouter()
const onPurchaseClick = () => {
  void router.push({ path: '/product/aleo' })
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminAppGoodStore()
const goods = computed(() => good.AppGoods.AppGoods)

onMounted(() => {
  if (goods.value.length > 0) {
    return
  }
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<AppGood>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

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

</script>
