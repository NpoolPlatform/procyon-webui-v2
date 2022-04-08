<template>
  <BackPage>
    <div class='content order-page'>
      <div class='product-container'>
        <div class='product-title-section'>
          <div class='product-page-icon'>
            <img :src='good?.Main?.Logo'>
          </div>
          <h1>{{ good?.Good?.Good?.Title }}</h1>
        </div>
        <div class='info'>
          <h3 class='form-title'>
            {{ $t('MSG_PRODUCT_DETAILS') }}
          </h3>
          <div class='info-flex'>
            <div class='three-section'>
              <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
              <span class='number'>*</span>
              <span class='unit'>{{ good?.Main?.Unit }} / {{ $t('MSG_DAY') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
              <span class='number'>{{ good?.Good?.Good?.DurationDays }}</span>
              <span class='unit'>{{ $t('MSG_DAYS') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
              <span class='number'>20</span>
              <span class='unit'>%</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_MAINTENANCE_FEE') }}:</h4>
              <span class='number'>1.5</span>
              <span class='unit'>USDT / {{ $t('MSG_DAY') }}</span>
            </div>
            <div class='three-section'>
              <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
              <span class='number'>{{ formatTime(good?.Good?.Good?.StartAt, true) }}</span>
            </div>
            <div class='product-detail-text'>
              <div v-if='description'>
                <h3>{{ description?.Title }}</h3>
                <p v-html='description?.Message' />
              </div>
              <h3>{{ $t('MSG_WHY_TITLE') }}?</h3>
              <p v-html='$t("MSG_WHY_CONTENT")' />
              <div v-if='good?.Main?.Specs'>
                <h3>Official {{ good?.Main?.Name }} Specs</h3>
                <p>
                  <img class='content-image' :src='good?.Main?.Specs'>
                </p>
              </div>
              <p>
                <a :href='good?.Main?.HomePage' target='_blank'>
                  {{ good?.Main?.Name }} Homepage >>
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class='product-sidebar'>
          <h3 class='form-title'>
            {{ $t('MSG_MINING_PURCHASE') }}
          </h3>
          <form action='javascript:void(0)' @submit='onSubmit'>
            <h4>{{ $t('MSG_PURCHASE_AMOUNT') }} ({{ good?.Good?.Good?.Unit }}s)</h4>
            <input type='number' v-model='purchaseAmount' required min='0'>
            <h4>{{ $t('MSG_PAYMENT_METHOD') }}</h4>
            <select :name='$t("MSG_PAYMENT_METHOD")' v-model='paymentCoin' required>
              <option
                v-for='myCoin in coins'
                :key='myCoin.ID'
                :value='myCoin'
                :selected='paymentCoin?.ID === myCoin.ID'
              >
                {{ myCoin.Unit }} ({{ myCoin.Name }})
              </option>
            </select>
            <!--<h4>Coupon Code</h4>
            <input type='text'>
            <div class='coupon-error'>Incorrect Coupon Code</div>-->
            <input type='submit' :value='$t("MSG_PURCHASE")' class='submit'>
          </form>
        </div>
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { useGoodStore, NotificationType, formatTime, useCoinStore, Good, Coin } from 'npool-cli-v2'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

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

const usedFor = ref('PRODUCT_DETAIL')
const coin = useCoinStore()
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale))
const paymentCoin = ref(undefined as unknown as Coin)
const purchaseAmount = ref(1)

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

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
    }, (good: Good) => {
      coin.getCoinDescription({
        CoinTypeID: good.Main?.ID as string,
        UsedFor: usedFor.value,
        Message: {
          Error: {
            Title: t('MSG_GET_COIN_DESCRIPTION'),
            Message: t('MSG_GET_COIN_DESCRIPTION_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      })
    })
  }

  if (coins.value.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS'),
          Message: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

const onSubmit = () => {
  // TODO
  console.log(paymentCoin.value, purchaseAmount.value)
}

</script>

<style lang='sass' scoped>
.product-detail-text
  width: 100%
</style>
