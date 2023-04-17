<template>
  <div class='content'>
    <div class='columns-2 highlight'>
      <div class='column-2'>
        <h1> <span v-html='$t("MSG_FIRST_BATCH_MINING_TITLE")' /> </h1>
        <h2><span v-html='$t("MSG_FIRST_BATCH_MINING_SUBTITLE")' /></h2>
        <p v-html='$t("MSG_FIRST_BATCH_MINING_CONTENT")' />
        <button @click='onIronFishClick'>
          {{ $t('MSG_LEARN_MORE') }}
        </button>
      </div>
      <div class='column-2'>
        <img src='product/aleo/procyon-product-aleo-homepage.png'>
        <div class='highlight-image'>
          <img src='project-iron-fish/procyon-product-iron-fish-homepage.jpg'>
          <span class='caption'>Iron Fish First Batch Mining sold out in less than 24 hours!</span>
        </div>
      </div>
    </div>
    <div class='columns-2 highlight'>
      <div class='column-2'>
        <h1><span v-html='$t("MSG_EXCLUSIVE_IDO_TITLE")' /></h1>
        <h2><span v-html='$t("MSG_EXCLUSIVE_IDO_SUBTITLE")' /></h2>
        <p v-html='$t("MSG_EXCLUSIVE_IDO_CONTENT")' />
        <button class='in-active' disabled>
          {{ $t('MSG_COMING_SOON') }}
        </button>
      </div>
      <div class='column-2'>
        <div class='highlight-image'>
          <img src='product/mixmob/procyon-ido-mixmob-homepage.png'>
          <span class='caption'>{{ $t('MSG_EXCLUSIVE_IDOS_INBOUND') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter()

const onIronFishClick = () => {
  void router.push({ path: '/product/ironfish' })
}

</script>

<style lang='sass' scoped>
.order-4,
.order-2
  min-width: 49%

.order-4
  margin-left: -40px
  @media (max-width: $breakpoint-sm-max)
    margin-left: 0
</style>
