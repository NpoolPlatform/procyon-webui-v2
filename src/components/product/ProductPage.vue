<template>
  <BackPage>
    <div class='content order-page'>
      <div :class='[ "product-container content-glass project", projectClass ]'>
        <div class='product-title-section project-title-section' :style='{"background-image": "url(" + bgImg + ")"}'>
          <div class='product-title-container'>
            <div class='product-page-icon'>
              <img :src='good?.Main?.Logo'>
            </div>
            <h1>{{ good?.Main?.Name }} {{ $t('MSG_MINING') }}</h1>
          </div>
        </div>
        <div class='info'>
          <h3 class='form-title'>
            {{ $t('MSG_PRODUCT_DETAILS') }}
          </h3>
          <div v-if='customizeInfo' class='info-flex'>
            <slot name='product-info' />
            <div class='product-detail-text'>
              <slot name='product-detail' />
            </div>
          </div>
          <div v-else class='info-flex'>
            <div class='three-section'>
              <h4>{{ $t('MSG_PRICE') }}:</h4>
              <span class='number'>{{ good?.Good?.Good?.Price }}</span>
              <span class='unit'>{{ PriceCoinName }}</span>
            </div>
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
              <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
              <span class='number'>{{ formatTime(good?.Good?.Good?.StartAt, true) }}</span>
            </div>
            <div class='product-detail-text'>
              <slot name='product-detail' />
            </div>
          </div>
        </div>
        <div class='product-sidebar'>
          <div id='product-form' class='product-sidebar-section'>
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
                :max='total'
                @focus='onPurchaseAmountFocusIn'
                @blur='onPurchaseAmountFocusOut'
              />
              <h4>{{ $t('MSG_PAYMENT_METHOD') }}</h4>
              <div v-show='paymentCoin'>
                <select :name='$t("MSG_PAYMENT_METHOD")' v-model='paymentCoin' required>
                  <option
                    v-for='myCoin in coins'
                    :key='myCoin?.ID'
                    :value='myCoin'
                    :selected='paymentCoin?.ID === myCoin?.ID'
                  >
                    {{ myCoin?.Unit }} ({{ currency.formatCoinName(myCoin?.Name as string) }})
                  </option>
                </select>
              </div>
              <!--<h4>Coupon Code</h4>
              <input type='text'>
              <div class='coupon-error'>Incorrect Coupon Code</div>-->
              <div class='submit-container'>
                <WaitingBtn
                  label='MSG_PURCHASE'
                  type='submit'
                  class='submit-btn'
                  :disabled='submitting || !buyer'
                  :waiting='submitting'
                />
              </div>
            </form>
          </div>
          <slot name='sidebar' />
        </div>
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import {
  formatTime,
  PriceCoinName,
  CoinDescriptionUsedFor,
  useCoinStore,
  useGoodStore,
  NotificationType,
  useCurrencyStore,
  useOrderStore,
  useStockStore,
  useUserStore
} from 'npool-cli-v2'
import { defineAsyncComponent, defineProps, toRef, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { throttle } from 'quasar'
import { ThrottleSeconds } from 'src/const/const'
import { useRouter } from 'vue-router'

const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  goodId: string
  projectClass: string
  bgImg: string
  customizeInfo?: boolean
}

const props = defineProps<Props>()
const goodId = toRef(props, 'goodId')
const projectClass = toRef(props, 'projectClass')
const bgImg = toRef(props, 'bgImg')
const customizeInfo = toRef(props, 'customizeInfo')

const coin = useCoinStore()
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale && coin.ENV === good.value?.Main?.ENV))
const selectedCoinID = ref(undefined as unknown as string)
const paymentCoin = computed({
  get: () => {
    const myCoin = coin.getCoinByID(selectedCoinID.value)
    if (!myCoin) {
      for (const scoin of coins.value) {
        if (scoin.Name?.toLowerCase().includes(PriceCoinName.toLowerCase())) {
          return scoin
        }
      }
      if (coins.value.length > 0) {
        return coins.value[0]
      }
      return undefined
    }
    return myCoin
  },
  set: (val) => {
    selectedCoinID.value = val?.ID as string
  }
})

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))

const stock = useStockStore()
const total = computed(() => stock.getStockByGoodID(goodId.value)?.Total)

const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))

const currency = useCurrencyStore()
const user = useUserStore()
const buyer = computed(() => user.buyer)

onMounted(() => {
  if (!good.value) {
    goods.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
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

  if (!total.value) {
    stock.getStocks({
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_STOCKS'),
          Message: t('MSG_GET_GOOD_STOCKS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

const purchaseAmount = ref(1)
const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 || purchaseAmount.value > total.value
}

const submitting = ref(false)

const order = useOrderStore()
const router = useRouter()

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
      PaymentCoinTypeID: paymentCoin.value?.ID as string,
      Message: {
        Error: {
          Title: t('MSG_CREATE_PAYMENT'),
          Message: t('MSG_CREATE_PAYMENT_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (paymentId: string, error: boolean) => {
      submitting.value = false
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
</style>
