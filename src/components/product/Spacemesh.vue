<template>
  <ProductPage :good-id='goodId' project-class='project-spacemesh' bg-img='product/spacemesh/spacemesh-banner.jpg'>
    <template #product-detail>
      <div v-show='description'>
        <h3>{{ description ? $t(description?.Title) : '' }}</h3>
        <p v-html='description ? $t(description?.Message) : ""' />
      </div>
      <h3>{{ $t('MSG_WHY_TITLE') }}?</h3>
      <p v-html='$t("MSG_WHY_CONTENT")' />
      <div v-show='good?.Main?.Specs'>
        <h3>{{ $t('MSG_OFFICIAL_SPECS', { COIN_NAME: good?.Main?.Name }) }}</h3>
        <p>
          <img class='content-image' :src='good?.Main?.Specs'>
        </p>
      </div>
      <p>
        <a :href='good?.Main?.HomePage'>
          {{ $t('MSG_HOMEPAGE_WITH_RIGHT_ARROW', { COIN_NAME: good?.Main?.Name }) }}
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
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CoinDescriptionUsedFor, useGoodStore, NotificationType, useCoinStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  goodId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodId = computed(() => query.value.goodId)

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))
const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)

const coin = useCoinStore()
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

onMounted(() => {
  if (!good.value) {
    goods.getGood({
      ID: goodId.value,
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD'),
          Message: t('MSG_GET_GOOD_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (!description.value) {
    coin.getCoinDescriptions({
      Message: {
        Error: {
          Title: t('MSG_GET_COIN_DESCRIPTIONS'),
          Message: t('MSG_GET_COIN_DESCRIPTIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

</script>

<style lang='sass' scoped>
</style>
