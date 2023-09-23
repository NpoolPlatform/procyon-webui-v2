<template>
  <div :class='[ showStatus || showWarning ? "blur" : "" ]'>
    <PurchasePage :good='(good as appgood.Good)'>
      <div class='info'>
        <h3 class='form-title'>
          {{ _order?.CoinName?.length ? utils.formatCoinName(_order?.CoinName as string) : '' }} | <strong>{{ $t('MSG_ORDER_ID') }}: {{ orderId }}</strong>
        </h3>
        <div class='info-flex'>
          <div class='three-section'>
            <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}:</h4>
            <span class='number'>{{ _order?.Units }}</span>
            <span class='unit'>{{ _order?.GoodUnit?.length ? $t(_order?.GoodUnit) : '' }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_AMOUNT_DUE') }}:</h4>
            <span class='number'>{{ _order?.PaymentAmount }}</span>
            <span class='unit'>{{ _order?.PaymentCoinUnit.length ? _order.PaymentCoinUnit : constant.PriceCoinName }}</span>
            <img class='copy-button' :src='copyIcon' @click='onCopyAmountClick'>
            <div class='tooltip'>
              <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
              <p class='tooltip-text'>
                {{ $t('MSG_PAYMENT_AMOUNT_TIP') }}
              </p>
            </div>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_TIME_REMAIN') }}:</h4>
            <span class='number'>{{ $t(remainSeconds) }}</span>
            <div class='tooltip'>
              <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
              <p class='tooltip-text'>
                {{ $t('MSG_PAYMENT_TIMEOUT_TIP') }}
              </p>
            </div>
          </div>
          <div class='full-section'>
            <h4>{{ $t('MSG_PAYMENT_ADDRESS') }}:</h4>
            <div v-if='showBUSDTip' class='warning warning-pink'>
              <img :src='warning'>
              <span v-html='$t("MSG_BUSD_PAYMENT_TIP")' />
            </div>
            <div v-else class='warning warning-pink'>
              <img :src='warning'>
              <span v-html='$t("MSG_COIN_PAYMENT_TIP", { COIN_NAME: coinName })' />
            </div>
            <span class='wallet-type'>{{ coinName }} &nbsp; </span>
            <span class='number'>  {{ _order?.PaymentAddress }}</span>
            <img class='copy-button' :src='copyIcon' @click='onCopyAddressClick'>
            <div class='tooltip'>
              <img class='more-info' :src='question'><span>{{ $t('MSG_LEARN_MORE') }}</span>
              <p class='tooltip-text'>
                {{ $t('MSG_PAYMENT_ADDRESS_TIP') }}
              </p>
            </div>
          </div>
        </div>
        <div class='hr' />
        <h4>{{ $t('MSG_IMPORTANT_INFORMATION') }}</h4>
        <p v-html='$t("MSG_PAYMENT_NOTE", { COIN_NAME: coinName })' />
      </div>
      <div class='order-form'>
        <h3 class='form-title'>
          {{ $t('MSG_SCAN_QR_CODE_TO_PAY') }}
        </h3>
        <div class='qr-code-container'>
          <div class='qr-code-container' ref='qrCodeContainer'>
            <h5>{{ coinName }}  {{ $t('MSG_ADDRESS') }}</h5>
            <qrcode-vue
              :value='_order?.PaymentAddress'
              :size='qrCodeContainer?.clientWidth as number - 1'
              :margin='3'
              class='qr-code'
            />
          </div>
        </div>
        <div class='hr' />
        <button @click='onPaymentProceed'>
          {{ $t('MSG_PROCEED_TO_DASHBOARD') }}
        </button>
        <button @click='onPaymentCanceled' class='alt'>
          {{ $t('MSG_CANCEL_ORDER') }}
        </button>
        <div class='warning'>
          <img :src='warning'>
          <span>{{ $t('MSG_PAYMENT_WARNING') }}</span>
        </div>
      </div>
    </PurchasePage>
  </div>
  <q-dialog
    v-model='showStatus'
    seamless
    maximized
  >
    <div class='product-container content-glass popup-container'>
      <div class='popup'>
        <PaymentState
          :order-id='query.orderId'
          :title='popupTitle'
          :tip-message='tipMessage'
          :state='orderStatus'
          :show-type='showType'
          :remain-time='remainTime'
          @proceed='onPaymentProceed'
        />
      </div>
    </div>
  </q-dialog>
  <q-dialog
    v-model='showWarning'
    seamless
    maximized
  >
    <div class='product-container content-glass popup-container'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_PAYMENT_WARNING_TITLE') }}</h3>
            <p v-html='$t("MSG_PAYMENT_WARNING_CONTENT_1")' />
            <div class='warning normal-tip'>
              <img :src='warning'>
              <span>{{ $t('MSG_PAYMENT_WARNING_CONTENT_2') }}</span>
            </div>
            <p v-html='$t("MSG_PAYMENT_WARNING_CONTENT_3")' />
            <button @click='showWarning = false'>
              {{ $t('MSG_I_UNDERSTAND') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog
    v-model='showCancelling'
    seamless
    maximized
  >
    <div class='product-container content-glass popup-container'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_ORDER_CANCELLATION_TITLE') }}</h3>
            <p v-html='$t("MSG_ORDER_CANCELLATION_CONTENT_1")' />
            <div class='warning red-warning'>
              <img :src='warning'>
              <span v-html='$t("MSG_ORDER_CANCELLATION_CONTENT_2")' />
            </div>
            <button @click='showCancelling = false' class='alt'>
              {{ $t('MSG_GO_BACK') }}
            </button>
            <button @click='onCancelOrderClick'>
              {{ $t('MSG_CANCEL_ORDER') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { order, appgood, utils, notify, constant } from 'src/npoolstore'
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import copy from 'copy-to-clipboard'

import copyIcon from 'src/assets/icon-copy.svg'
import question from 'src/assets/question.svg'
import warning from 'src/assets/warning.svg'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))
const PaymentState = defineAsyncComponent(() => import('src/components/purchase/PaymentState.vue'))

interface Query {
  orderId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const orderId = computed(() => query.value.orderId)

const odr = order.useOrderStore()
const _order = computed(() => odr.order(orderId.value))

const appGood = appgood.useAppGoodStore()
const good = computed(() => appGood.good(undefined, _order.value?.AppGoodID as string))

const notification = notify.useNotificationStore()

const remainSeconds = ref(odr.orderState(_order.value?.ID as string))
const ticker = ref(-1)
const counter = ref(0)

const qrCodeContainer = ref<HTMLDivElement>()

const showStatus = ref(false)
const popupTitle = ref('')
const tipMessage = ref('')
const orderStatus = ref('')
const showType = ref('')
const remainTime = ref(order.RemainMax)
const showWarning = ref(true)
const showCancelling = ref(false)

const coinName = computed(() => {
  if (!_order.value?.PaymentCoinName?.length) {
    return
  }
  if (_order.value?.PaymentCoinName?.toLowerCase()?.includes('bitcoin')) {
    return 'BTC (Bitcoin)'
  } else if (_order.value?.PaymentCoinName?.toLowerCase()?.includes('binanceusd')) {
    return 'BUSD (BEP20)'
  } else if (_order.value?.PaymentCoinName?.toLowerCase()?.includes('usdcerc20')) {
    return 'USDC (ERC20)'
  } else if (_order.value?.PaymentCoinName?.toLowerCase()?.includes('usdterc20')) {
    return 'USDT (ERC20)'
  } else if (_order.value?.PaymentCoinName?.toLowerCase()?.includes('usdttrc20')) {
    return 'USDT (TRC20)'
  }
  return utils.formatCoinName(_order.value?.PaymentCoinName)
})

const showBUSDTip = computed(() => _order.value?.PaymentCoinName?.toLowerCase()?.includes('binanceusd'))

const remainTicker = ref(-1)
watch(counter, () => {
  if (counter.value % 30 === 0) {
    odr.getOrder({
      ID: _order.value?.ID as string,
      Message: {
        Error: {
          Title: 'MSG_GET_ORDER',
          Message: 'MSG_GET_ORDER_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
    // TODO
    })
  }
})

const launchTicker = () => {
  ticker.value = window.setInterval(() => {
    remainSeconds.value = odr.orderState(_order.value?.ID as string)

    if (odr.orderPaid(_order.value?.ID as string)) {
      showStatus.value = true
      popupTitle.value = 'MSG_ORDER_COMPLETE'
      tipMessage.value = 'MSG_REVIEW_ORDER'
      orderStatus.value = 'MSG_COMPLETE'
      showType.value = 'date'
      if (remainTicker.value >= 0) {
        clearInterval(remainTicker.value)
        remainTicker.value = -1
      }
      return
    }

    let start = _order.value ? _order.value?.CreatedAt : 0
    start += order.OrderTimeoutSeconds
    remainTime.value = utils.remain(start)
    if (remainTime.value === utils.RemainZero) {
      showStatus.value = true
      popupTitle.value = 'MSG_ORDER_TIMEOUT'
      tipMessage.value = 'MSG_ORDER_TIMEOUT'
      orderStatus.value = 'MSG_TIMEOUT'
      if (remainTicker.value >= 0) {
        clearInterval(remainTicker.value)
        remainTicker.value = -1
      }
    }
    counter.value++
  }, 1000)
}

onMounted(() => {
  odr.getOrder({
    ID: orderId.value,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDER',
        Message: 'MSG_GET_ORDER_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, o?: order.Order) => {
    if (error || !odr.validateOrder(o?.ID as string)) {
      return
    }
    launchTicker()
  })
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
  odr.$reset()
})

const router = useRouter()

const onPaymentProceed = () => {
  void router.push({
    path: '/dashboard'
  })
}

const onPaymentCanceled = () => {
  showCancelling.value = true
}

const onCancelOrderClick = () => {
  showCancelling.value = false
  odr.updateOrder({
    ID: _order.value?.ID as string,
    Canceled: true,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_PAYMENT',
        Message: 'MSG_UPDATE_PAYMENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) return

    void router.push({
      path: '/dashboard'
    })
  })
}

const onCopyAmountClick = () => {
  copy(_order.value?.PaymentAmount as string)
  notification.Notifications.push({
    Title: 'MSG_AMOUNT_COPIED',
    Message: 'MSG_COPY_AMOUNT_SUCCESS',
    Popup: true,
    Type: notify.NotifyType.Success
  })
}

const onCopyAddressClick = () => {
  copy(_order.value?.PaymentAddress as string)
  notification.Notifications.push({
    Title: 'MSG_ADDRESS_COPIED',
    Message: 'MSG_COPY_ADDRESS_SUCCESS',
    Popup: true,
    Type: notify.NotifyType.Success
  })
}

</script>

<style lang='sass' scoped>
.qr-code-container
  margin: 24px 0
  text-align: center
  width: 100%

.qr-code
  border-radius: 0 0 12px 12px
  width: 100%

.qr-code-container h5
  background: #fc4468
  border-radius: 12px 12px 0 0
  font-size: 20px
  font-weight: 400
  margin: 0
  padding: 4px
  text-transform: uppercase

.product-container
  background: transparent

.normal-tip
  padding: 12px
  margin: 24px 0

::v-deep p:not([class]) strong
  background: linear-gradient(to left, #ff964a 0, #ffcc4a 50%)
  background-clip: border-box
  font-weight: 500
  -webkit-background-clip: text
  -webkit-box-decoration-break: clone
  -webkit-text-fill-color: transparent
</style>
