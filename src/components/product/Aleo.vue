<template>
  <ProductPage :good-id='goodId' project-class='project-aleo' bg-img='product/aleo/aleo-banner.jpg'>
    <template #product-detail>
      <div v-show='description'>
        <h3>{{ description ? $t(description?.Title) : '' }}</h3>
        <p v-html='description ? $t(description?.Message) : ""' />
      </div>
      <h4>{{ $t('MSG_VC_INVESTMENT') }}</h4>
      <p v-html='$t("MSG_VC_INVESTMENT_CAPTION")' />
      <div class='logo-display'>
        <div><img src='vc-logos/a16z.png'></div>
        <div><img src='vc-logos/coinbase.png'></div>
        <div><img src='vc-logos/kora.png'></div>
        <div><img src='vc-logos/polychain-capital.png'></div>
        <div><img src='vc-logos/samsung-next.png'></div>
        <div><img src='vc-logos/sea-capital.png'></div>
        <div><img src='vc-logos/slow-ventures.png'></div>
        <div><img src='vc-logos/softbank-vision-fund.png'></div>
        <div><img src='vc-logos/tiger-global.png'></div>
      </div>
      <h3>{{ $t('MSG_ALEO_TOKENOMICS') }}</h3>
      <p><img class='project-promo-content' src='product/aleo/aleo-posw-small.jpg'></p>
      <p v-html='$t("MSG_ALEO_TOKENOMICS_CAPTION")' />
      <h3>{{ $t('MSG_ALEO_VS_COMPETITORS') }}</h3>
      <p v-html='$t("MSG_ALEO_VS_COMPETITORS_CAPTION")' />
      <p><img class='project-promo-content' src='product/aleo/aleo-comparison.png'></p>
      <h3>{{ $t('MSG_ALEO_ALGORITHM') }}</h3>
      <p v-html='$t("MSG_ALEO_ALGORITHM_CAPTION")' />
      <p><img class='project-promo-content' src='product/aleo/aleo-algorithm.png'></p>
      <h3>{{ $t('MSG_ALEO_FUTURE') }}</h3>
      <p v-html='$t("MSG_ALEO_FUTURE_CAPTION")' />
      <h3>{{ $t('MSG_ALEO_TEAM') }}</h3>
      <div class='project-team'>
        <div v-for='member in members' :key='member.Name' class='team-member'>
          <h4 class='name'>
            {{ member.Name }}
          </h4>
          <h5 class='title'>
            {{ member.Title }}
          </h5>
          <p v-html='$t(member.Background)' />
        </div>
      </div>
    </template>
    <template #sidebar>
      <div id='project-links' class='product-sidebar-section'>
        <h3 class='form-title'>
          {{ $t('MSG_PROJECT_LINKS') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href='https://www.aleo.org/' target='_blank'><img class='link-icon' src='font-awesome/homepage.svg'>
              <span>{{ $t('MSG_ALEO_HOMEPAGE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://twitter.com/AleoHQ' target='_blank'><img class='link-icon' src='font-awesome/twitter.svg'>
              <span>{{ $t('MSG_TWITTER') }}</span>
            </a>
          </li>
          <li>
            <a href='https://www.youtube.com/channel/UCS_HKT2heOC_q88YQLiJt0g' target='_blank'><img class='link-icon' src='font-awesome/youtube.svg'>
              <span>{{ $t('MSG_YOUTUBE') }}</span>
            </a>
          </li>
          <li>
            <a href='https://discord.com/invite/aleohq' target='_blank'><img class='link-icon' src='font-awesome/discord.svg'>
              <span>{{ $t('MSG_DISCORD') }}</span>
            </a>
          </li>
          <li>
            <a href='https://github.com/AleoHQ' target='_blank'><img class='link-icon' src='font-awesome/github.svg'>
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
            <a href=''>
              <img class='link-icon' src='font-awesome/lightbulb.svg'>
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

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))
const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)

const coin = useCoinStore()
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))

interface Member {
  Name: string
  Title: string
  Background: string
}

const members = computed(() => [
  {
    Name: 'Howard Wu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_HOWARD_WU_BACKGROUND')
  }, {
    Name: 'Howard Wu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_HOWARD_WU_BACKGROUND')
  }, {
    Name: 'Howard Wu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_HOWARD_WU_BACKGROUND')
  }, {
    Name: 'Howard Wu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_HOWARD_WU_BACKGROUND')
  }
] as Array<Member>)

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
