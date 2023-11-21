<template>
  <div class='content'>
    <div class='columns-2 highlight'>
      <div class='column-2'>
        <h1 v-html='$t("MSG_FIRST_BATCH_MINING_TITLE")' />
        <h2 v-html='$t("MSG_FIRST_BATCH_MINING_SUBTITLE")' />
        <p v-html='$t("MSG_FIRST_BATCH_MINING_CONTENT")' />
        <button @click='onIronFishClick' class='in-active' disabled>
          {{ $t('MSG_IRON_FISH_BUTTON_LEARN_MORE') }}
        </button>
      </div>
      <div class='column-2'>
        <div class='highlight-image'>
          <img src='product/iron/procyon-product-iron-fish-homepage.jpg'>
          <span class='caption'>{{ $t('MSG_IRON_FISH_FIRST_BATCH_MINING_TIP') }}</span>
        </div>
      </div>
    </div>

    <div class='columns-2 highlight'>
      <div class='column-2'>
        <h1 v-html='$t("MSG_PROCYON_ACADEMY_TITLE")' />
        <h2 v-html='$t("MSG_PROCYON_ACADEMY_SUB_TITLE")' />
        <ul v-html='$t("MSG_PROCYON_ACADEMY_CONTENT")' />
        <button class='in-active' disabled>
          {{ $t('MSG_COMING_SOON') }}
        </button>
      </div>
      <div class='column-2'>
        <div class='highlight-image'>
          <img src='product/academy/procyon-academy-homepage.png'>
          <span class='caption'><span v-html='$t("MSG_PROCYON_ACADEMY_TIP")' /></span>
        </div>
      </div>
    </div>

    <div class='columns-2 highlight'>
      <div class='column-2'>
        <h1 v-html='$t("MSG_EXCLUSIVE_IDO_TITLE")' />
        <h2 v-html='$t("MSG_EXCLUSIVE_IDO_SUBTITLE")' />
        <p v-html='$t("MSG_EXCLUSIVE_IDO_CONTENT")' />
        <button class='in-active' disabled>
          {{ $t('MSG_COMING_SOON') }}
        </button>
      </div>
      <div class='column-2'>
        <div class='highlight-image'>
          <img src='product/mixmob/procyon-ido-mixmob-homepage.jpg'>
          <span class='caption'>{{ $t('MSG_EXCLUSIVE_IDO_TIP') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { localapp } from 'src/npoolstore'

const app = localapp.useLocalApplicationStore()
const jumpPath = computed(() => app.commitBtnTargets()[0] || '/product/aleo')

const router = useRouter()
const onIronFishClick = () => {
  void router.push({ path: jumpPath.value })
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
