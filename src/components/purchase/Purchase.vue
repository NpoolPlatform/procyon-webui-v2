<template>
  <PurchasePage :good='good'>
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
          <span class='unit'>{{ PriceCoinName }} / {{ $t('MSG_DAY') }}</span>
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
        </div>
      </div>
    </div>
    <div class='product-sidebar'>
      <h3 class='form-title'>
        {{ $t('MSG_MINING_PURCHASE') }}
      </h3>
      <form action='javascript:void(0)' @submit='onSubmit' id='purchase'>
        <h4>{{ $t('MSG_PURCHASE_AMOUNT') }} ({{ good?.Good?.Good?.Unit }}s)</h4>
        <Input
          v-model:value='purchaseAmount'
          type='number'
          id='amount'
          required
          :error='purchaseAmountError'
          message='MSG_AMOUNT_TIP'
          placeholder='MSG_AMOUNT_PLACEHOLDER'
          :min='0'
          :max='good?.Good?.Good?.Total'
          @focus='onPurchaseAmountFocusIn'
          @blur='onPurchaseAmountFocusOut'
        />
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
        <div class='submit-container'>
          <WaitingBtn
            label='MSG_PURCHASE'
            type='submit'
            class='submit-btn'
            :disabled='submitting'
            :waiting='submitting'
          />
        </div>
      </form>
    </div>
  </PurchasePage>
</template>

<script setup lang='ts'>
import {
  useGoodStore,
  NotificationType,
  formatTime,
  useCoinStore,
  Good,
  Coin,
  useOrderStore,
  PriceCoinName
} from 'npool-cli-v2'
import { throttle } from 'quasar'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ThrottleSeconds } from 'src/const/const'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

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

const usedFor = ref('PRODUCTDETAILS')
const coin = useCoinStore()
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale))
const paymentCoin = ref(undefined as unknown as Coin)

const purchaseAmount = ref(1)
const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 || purchaseAmount.value > good?.value.Good?.Good?.Total
}

const submitting = ref(false)

const order = useOrderStore()
const router = useRouter()

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
      coin.getCoinDescriptions({
        CoinTypeID: good.Main?.ID as string,
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
  } else {
    coin.getCoinDescriptions({
      CoinTypeID: good.value.Main?.ID as string,
      Message: {
        Error: {
          Title: t('MSG_GET_COIN_DESCRIPTION'),
          Message: t('MSG_GET_COIN_DESCRIPTION_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
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
    }, () => {
      // TODO
    })
  }
})

const onSubmit = throttle(() => {
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }

  submitting.value = true

  order.submitOrder({
    GoodID: goodId.value,
    Units: purchaseAmount.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (orderId: string, error: boolean) => {
    if (error) {
      submitting.value = false
      return
    }

    order.createPayment({
      OrderID: orderId,
      PaymentCoinTypeID: paymentCoin.value.ID as string,
      Message: {
        Error: {
          Title: t('MSG_CREATE_PAYMENT'),
          Message: t('MSG_CREATE_PAYMENT_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (paymentId: string, error: boolean) => {
      submitting.value = true
      if (error) {
        return
      }

      void router.push({
        path: '/payment',
        query: {
          paymentId: paymentId,
          orderId: orderId
        }
      })
    })
  })
}, ThrottleSeconds * 1000)

</script>

<style lang='sass' scoped>
.product-detail-text
  width: 100%

.submit-btn
  margin-top: 24px
</style>
