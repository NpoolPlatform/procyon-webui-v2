<template>
  <ProductPage
    :good-id='goodID'
    project-class='project-spacemesh'
    bg-img='product/spacemesh/spacemesh-banner.jpg'
    :customize-info='false'
  >
    <template #product-detail>
      <div v-show='coinDescription'>
        <h3>{{ coinDescription ? $t(coinDescription?.Title) : '' }}</h3>
        <p v-html='coinDescription ? $t(coinDescription?.Message) : ""' />
      </div>
      <h3>
        <span v-html='$t("MSG_WHY_TITLE")' />
      </h3>
      <p v-html='$t("MSG_WHY_CONTENT")' />
      <div v-show='targetCoin?.Specs'>
        <h3>{{ $t('MSG_OFFICIAL_SPECS', { COIN_NAME: target?.CoinName }) }}</h3>
        <p>
          <img class='content-image' :src='targetCoin?.Specs'>
        </p>
      </div>
      <p>
        <a :href='targetCoin?.HomePage'>
          {{ $t('MSG_HOMEPAGE_WITH_RIGHT_ARROW', { COIN_NAME: target?.CoinName }) }}
        </a>
      </p>
    </template>
    <template #sidebar>
      <div id='project-links' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_PROJECT_LINKS') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href='https://spacemesh.io/' target='_blank'><img class='link-icon' src='font-awesome/homepage.svg'>
              <span>{{ $t('MSG_SPACEMESH_HOMEPAGE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://twitter.com/teamspacemesh' target='_blank'><img class='link-icon' src='font-awesome/twitter.svg'>
              <span>{{ $t('MSG_TWITTER') }}</span>
            </a>
          </li>
          <li>
            <a href='https://medium.com/spacemesh' target='_blank'><img class='link-icon' src='font-awesome/medium.svg'>
              <span>{{ $t('MSG_MEDIUM') }}</span>
            </a>
          </li>
          <li>
            <a href='https://www.youtube.com/channel/UCn-0T-qeP_SmKoiyvX49oVg' target='_blank'><img class='link-icon' src='font-awesome/youtube.svg'>
              <span>{{ $t('MSG_YOUTUBE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://discord.com/invite/yVhQ7rC' target='_blank'><img class='link-icon' src='font-awesome/discord.svg'>
              <span>{{ $t('MSG_DISCORD') }}</span>
            </a>
          </li>
          <li>
            <a href='https://github.com/spacemeshos' target='_blank'><img class='link-icon' src='font-awesome/github.svg'>
              <span>{{ $t('MSG_GITHUB') }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div id='help' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_HELP_AND_FAQ') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href=''><img class='link-icon' src='font-awesome/lightbulb.svg'>
              <span>{{ $t('MSG_MINING_BASICS') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </template>
  </ProductPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CoinDescriptionUsedFor, InvalidID, NotifyType, useAdminAppCoinStore, useAdminAppGoodStore, useAdminCoinDescriptionStore } from 'npool-cli-v4'
import { getDescriptions } from 'src/api/chain'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  goodId: string;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodID.value))

const goodID = computed(() => query.value.goodId?.length > 0 ? query.value.goodId : defaultGoodID.value)

const getGood = (goodID:string) => {
  good.getAppGood({
    GoodID: goodID,
    Message: {
      Error: {
        Title: t('MSG_GET_GOOD'),
        Message: t('MSG_GET_GOOD_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

// Use CoinUnit to find GoodID from AppDefaultGood
const coinUnit = 'SMH'
const defaultGoodID = computed(() => {
  if (query.value?.goodId?.length > 0) {
    getGood(query.value?.goodId)
    return query.value?.goodId
  }
  if (coin.AppCoins.AppCoins?.length === 0) {
    return `${InvalidID}_`
  }
  const goodID = coin.getGoodIDByCoinUnit(coinUnit)
  if (!goodID || goodID?.length === 0) {
    return InvalidID
  }
  if (goodID?.length > 0) {
    getGood(goodID)
  }
  return goodID
})

const coin = useAdminAppCoinStore()
const targetCoin = computed(() => coin.getCoinByID(target.value?.CoinTypeID as string))

const description = useAdminCoinDescriptionStore()
const coinDescription = computed(() => description.getCoinDescriptionByCoinUsedFor(target.value?.CoinTypeID as string, CoinDescriptionUsedFor.ProductPage))

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

const router = useRouter()

watch(defaultGoodID, () => {
  if (defaultGoodID.value === InvalidID) {
    void router.push({ path: '/' })
  }
})

onMounted(() => {
  console.log('CoinUnit: ', coinUnit)

  if (description.CoinDescriptions.CoinDescriptions.length === 0) {
    getDescriptions(0, 100)
  }

  if (defaultGoodID.value === `${InvalidID}_`) {
    return
  }

  if (defaultGoodID.value === InvalidID) {
    void router.push({ path: '/' })
  }
})

</script>

<style lang='sass' scoped>
</style>
