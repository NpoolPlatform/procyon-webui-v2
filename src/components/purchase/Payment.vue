<template>
  <div :class='[ showStatus || showWarning ? "blur" : "" ]'>
    <PurchasePage :good='order?.Good'>
      <div class='info'>
        <h3 class='form-title'>
          {{ order?.PayWithCoin?.Name }} | <strong>{{ $t('MSG_ORDER_ID') }}: {{ orderId }}</strong>
        </h3>
        <div class='info-flex'>
          <div class='three-section'>
            <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}:</h4>
            <span class='number'>{{ order?.Order?.Order?.Units }}</span>
            <span class='unit'>{{ order?.Good?.Good?.Good?.Unit }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_AMOUNT_DUE') }}:</h4>
            <span class='number'>{{ order?.Order?.Payment?.Amount }}</span>
            <span class='unit'>{{ order?.PayWithCoin?.Unit }}</span>
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
            <span class='wallet-type'>{{ order?.PayWithCoin?.Name }}</span>
            <span class='number'>{{ order?.PayToAccount?.Address }}</span>
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
        <p v-html='$t("MSG_PAYMENT_NOTE", { COIN_NAME: order?.PayWithCoin?.Name })' />
      </div>
      <div class='order-form'>
        <h3 class='form-title'>
          {{ $t('MSG_SCAN_QR_CODE_TO_PAY') }}
        </h3>
        <div class='qr-code-container'>
          <div class='qr-code-container' ref='qrCodeContainer'>
            <h5>{{ order?.PayWithCoin?.Name }} {{ $t('MSG_ADDRESS') }}</h5>
            <qrcode-vue
              :value='order?.PayToAccount?.Address'
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
    <div class='product-container'>
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
    <div class='product-container content-glass'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_PAYMENT_WARNING_TITLE') }}</h3>
            <p v-html='$t("MSG_PAYMENT_WARNING_CONTENT_1")' />
            <div class='warning red-warning'>
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
    <div class='product-container content-glass'>
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
import { useOrderStore, NotificationType, RemainMax, RemainZero, remain, OrderTimeoutSeconds, useNotificationStore } from 'npool-cli-v2'
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import copy from 'copy-to-clipboard'

import copyIcon from 'src/assets/icon-copy.svg'
import question from 'src/assets/question.svg'
import warning from 'src/assets/warning.svg'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))
const PaymentState = defineAsyncComponent(() => import('src/components/purchase/PaymentState.vue'))

interface Query {
  paymentId: string
  orderId: string
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const orderId = computed(() => query.value.orderId)

const orders = useOrderStore()
const order = computed(() => orders.getOrderByID(orderId.value))

const notification = useNotificationStore()

const remainSeconds = ref(orders.getOrderState(order.value))
const ticker = ref(-1)
const counter = ref(0)

const qrCodeContainer = ref<HTMLDivElement>()

const showStatus = ref(false)
const popupTitle = ref('')
const tipMessage = ref('')
const orderStatus = ref('')
const showType = ref('')
const remainTime = ref(RemainMax)
const showWarning = ref(true)
const showCancelling = ref(false)

const remainTicker = ref(-1)

watch(counter, () => {
  if (counter.value % 30 === 0) {
    orders.getOrder({
      ID: orderId.value,
      Message: {
        Error: {
          Title: t('MSG_GET_ORDER'),
          Message: t('MSG_GET_ORDER_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

const launchTicker = () => {
  ticker.value = window.setInterval(() => {
    remainSeconds.value = orders.getOrderState(order.value)

    if (orders.orderPaid(order.value)) {
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

    let start = order.value?.Order.Payment ? order.value?.Order.Payment.CreateAt : 0
    start += OrderTimeoutSeconds
    remainTime.value = remain(start)
    if (remainTime.value === RemainZero) {
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
  if (order.value) {
    if (!orders.validateOrder(order.value)) {
      return
    }
    launchTicker()
    return
  }

  orders.getOrder({
    ID: orderId.value,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDER'),
        Message: t('MSG_GET_ORDER_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (!orders.validateOrder(order.value)) {
      return
    }
    launchTicker()
  })
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
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

  const payment = order.value.Order.Payment
  payment.UserSetCanceled = true
  orders.updatePayment({
    Info: payment,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_PAYMENT'),
        Message: t('MSG_UPDATE_PAYMENT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    void router.push({
      path: '/dashboard'
    })
  })
}

const onCopyAmountClick = () => {
  copy(order.value?.Order.Payment?.Amount.toString())
  notification.Notifications.push({
    Title: t('MSG_AMOUNT_COPIED'),
    Message: t('MSG_COPY_AMOUNT_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
  })
}

const onCopyAddressClick = () => {
  copy(order.value?.PayToAccount?.Address)
  notification.Notifications.push({
    Title: t('MSG_ADDRESS_COPIED'),
    Message: t('MSG_COPY_ADDRESS_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
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
</style>
