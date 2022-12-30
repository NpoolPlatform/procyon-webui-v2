<template>
  <ProductPage
    :good-id='goodID'
    :purchase-amount='purchaseAmount'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    :customize-info='true'
  >
    <template #product-info>
      <div class='three-section'>
        <h4>{{ $t('MSG_PRICE') }}:</h4>
        <span class='number'>{{ good.getPrice(goodID) }}</span>
        <span class='unit'>{{ PriceCoinName }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_PRICE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
        <span class='number'>*</span>
        <span class='unit'>{{ target?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_DAILY_REWARD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
        <span class='number'>{{ target?.DurationDays }}</span>
        <span class='unit'>{{ $t('MSG_DAYS') }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_SERVICE_PERIOD_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
        <span class='number'>20</span>
        <span class='unit'>%</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_TECHNIQUE_SERVICE_FEE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section'>
        <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
        <span class='number'>{{ true ? 'TBD*' : good.getFormatTime(target?.StartAt) }}</span>
        <div class='tooltip'>
          <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_ORDER_EFFECTIVE_TIP') }}
          </p>
        </div>
      </div>
      <div class='three-section' v-if='good.haveSale(target)'>
        <h4>{{ $t("MSG_SALE_END_DATE") }}</h4>
        <span class='number'>{{ good.getSaleEndDate(target) }}</span>
        <span class='unit'>{{ good.getSaleEndTime(target) }} {{ $t("MSG_JST") }}</span>
        <div class='tooltip'>
          <img class='more-info' src='font-awesome/question.svg'><span>{{ $t('MSG_LEARN_MORE') }}</span>
          <p class='tooltip-text'>
            {{ $t('MSG_SALE_END_DATE_TIP') }}
          </p>
        </div>
      </div>
    </template>
    <template #product-detail>
      <div v-show='coinDescription'>
        <h3>{{ coinDescription ? $t(coinDescription?.Title) : '' }}</h3>
        <p v-html='coinDescription ? $t(coinDescription?.Message) : ""' />
      </div>
      <h3>{{ $t('MSG_VC_INVESTMENT') }}</h3>
      <p v-html='$t("MSG_VC_INVESTMENT_CAPTION")' />
      <div class='logo-display'>
        <div><img src='vc-logos/softbank-vision-fund.png'></div>
        <div><img src='vc-logos/a16z.png'></div>
        <div><img src='vc-logos/polychain-capital.png'></div>
        <div><img src='vc-logos/coinbase.png'></div>
        <div><img src='vc-logos/samsung-next.png'></div>
        <div><img src='vc-logos/slow-ventures.png'></div>
        <div><img src='vc-logos/dekrypt-capital.png'></div>
        <div><img src='vc-logos/kora.png'></div>
        <div><img src='vc-logos/sea-capital.png'></div>
        <div><img src='vc-logos/tiger-global.png'></div>
        <div><img src='vc-logos/zkv.png'></div>
        <div><img src='vc-logos/placeholder.png'></div>
        <div><img src='vc-logos/scalar-capital.png'></div>
        <div><img src='vc-logos/galaxy-digital.png'></div>
        <div><img src='vc-logos/variant.png'></div>
        <div><img src='vc-logos/ethereal-ventures.png'></div>
        <div><img src='vc-logos/a_capital.png'></div>
        <div><img src='vc-logos/david-namdar.png'></div>
        <div><img src='vc-logos/balaji-srinivasan.png'></div>
      </div>
      <h3>{{ $t('MSG_WHY_ALEO_IMPORTANT_TO_WEB3') }}</h3>
      <p v-html='$t("MSG_WHY_ALEO_IMPORTANT_TO_WEB3_CAPTION")' />
      <h3>{{ $t('MSG_ALEO_TEAM') }}</h3>
      <p v-html='$t("MSG_ALEO_TEAM_CAPTION")' />
      <div class='project-team'>
        <div v-for='member in members' :key='member.Name' class='team-member'>
          <h4 class='name'>
            {{ member.Name }}
          </h4>
          <h5 class='title'>
            {{ $t(member.Title) }}
          </h5>
          <p class='bio' v-html='$t(member.Background)' />
        </div>
      </div>
      <h3>{{ $t('MSG_ALEO_TOKENOMICS') }}</h3>
      <p><img class='project-promo-content' :src='locale === "ja-JP" ? "product/aleo/aleo-posw-jp.jpg" : "product/aleo/aleo-posw-en.jpg"'></p>
      <p>
        <a href='https://coingenius.news/tokenomics-aleo/'>{{ $t('MSG_ALEO_TOKENOMICS_COINGENIUS_NEWS') }}</a>
      </p>
      <p v-html='$t("MSG_ALEO_TOKENOMICS_CAPTION")' />
      <h3>{{ $t('MSG_ALEO_VS_COMPETITORS') }}</h3>
      <p v-html='$t("MSG_ALEO_VS_COMPETITORS_CAPTION")' />
      <p><img class='project-promo-content' :src='locale === "ja-JP" ? "product/aleo/aleo-comparison-jp.png" : "product/aleo/aleo-comparison-en.png"'></p>
      <h4>{{ $t('MSG_ZK_PROOF_PRIVACY') }}</h4>
      <p v-html='$t("MSG_ZK_PROOF_PRIVACY_CAPTION")' />
      <p><img class='project-promo-content' :src='locale === "ja-JP" ? "product/aleo/aleo-algorithm-jp.png" : "product/aleo/aleo-algorithm-en.png"'></p>
      <h3>{{ $t('MSG_ALEO_FUTURE') }}</h3>
      <p v-html='$t("MSG_ALEO_FUTURE_CAPTION_1")' />
      <div class='logo-display'>
        <div><img src='vc-logos/coinbase.png'></div>
        <div><img src='vc-logos/gemini.png'></div>
        <div><img src='vc-logos/kraken.png'></div>
        <div><img src='vc-logos/binance.png'></div>
        <div><img src='vc-logos/huobi.png'></div>
        <div><img src='vc-logos/okex.png'></div>
      </div>
      <p v-html='$t("MSG_ALEO_FUTURE_CAPTION_2")' />
      <h3>{{ $t('MSG_RISK_WARNING_AND_DISCLAIMER') }}</h3>
      <p v-html='$t("MSG_RISK_WARNING_AND_DISCLAIMER_CAPTION")' />
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
          {{ $t('MSG_PRODUCT_FAQ') }}
        </h3>
        <ul class='product-links'>
          <li>
            <a href='https://drive.google.com/file/d/1DuZm_aDiqojpA6VlDq_z4Dt3JTi44XVe/view?usp=share_link'>
              <img class='link-icon' :src='lightbulb'>
              <span>{{ $t('MSG_PDF_MANUAL') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </template>
  </ProductPage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import question from '../../assets/question.svg'
import lightbulb from '../../assets/lightbulb.svg'
import { DefaultGoodID } from 'src/const/const'
import { AppGood, NotifyType, useAdminAppGoodStore, useAdminCoinDescriptionStore, CoinDescriptionUsedFor, useAdminCurrencyStore } from 'npool-cli-v4'
import { getCurrencies, getDescriptions } from 'src/api/chain'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ProductPage = defineAsyncComponent(() => import('src/components/product/ProductPage.vue'))

interface Query {
  goodId: string;
  purchaseAmount: number;
}

const { locale } = useI18n({ useScope: 'global' })

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodID = computed(() => query.value.goodId?.length ? query.value.goodId : DefaultGoodID)
const purchaseAmount = computed(() => query.value.purchaseAmount)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodID.value) as AppGood)

const currency = useAdminCurrencyStore()

const description = useAdminCoinDescriptionStore()
const coinDescription = computed(() => description.getCoinDescriptionByCoinUsedFor(target.value?.CoinTypeID, CoinDescriptionUsedFor.ProductPage))

interface Member {
  Name: string;
  Title: string;
  Background: string;
}

const members = computed(() => [
  {
    Name: 'Howard Wu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_HOWARD_WU_BACKGROUND')
  }, {
    Name: 'Collin Chin',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_COLLIN_CHIN_BACKGROUND')
  }, {
    Name: 'Raymond Chu',
    Title: t('MSG_CO_FOUNDER'),
    Background: t('MSG_RAYMOND_CHU_BACKGROUND')
  }, {
    Name: 'Michael Beller',
    Title: t('MSG_CFO'),
    Background: t('MSG_MICHAEL_BELLER_BACKGROUND')
  }
] as Array<Member>)

onMounted(() => {
  good.getAppGood({
    GoodID: goodID.value,
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

  if (description.CoinDescriptions.CoinDescriptions.length === 0) {
    getDescriptions(0, 100)
  }
  if (currency.Currencies.Currencies.length === 0 || currency.expired()) {
    currency.$reset()
    getCurrencies(0, 100)
  }
})

</script>

<style lang='sass' scoped>
</style>
