<template>
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
          <img class='copy-button' :src='copy'>
        </div>
        <div class='three-section'>
          <h4>{{ $t('MSG_TIME_REMAIN') }}:</h4>
          <span class='number'>{{ remainSeconds }}</span>
        </div>
        <div class='full-section'>
          <h4>{{ $t('MSG_PAYMENT_ADDRESS') }}:</h4>
          <span class='wallet-type'>{{ order?.PayWithCoin?.Name }}</span>
          <span class='number'>{{ order?.PayToAccount?.Address }}</span>
          <img class='copy-button' :src='copy'>
        </div>
      </div>
      <div class='hr' />
      <h4>{{ $t('MSG_IMPORTANT_INFORMATION') }}</h4>
      <p v-html='$t("MSG_PAYMENT_NOTE")' />
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
      <button @click='onPaymentCompletedClick'>
        {{ $t('MSG_PAYMENT_COMPLETED') }}
      </button>
      <button class='alt' @click='onPayLaterClick'>
        {{ $t('MSG_PAY_LATER') }}
      </button>
    </div>
  </PurchasePage>
</template>

<script setup lang='ts'>
import { useOrderStore, NotificationType } from 'npool-cli-v2'
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import copy from 'src/assets/icon-copy.svg'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))

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

const remainSeconds = ref(orders.getOrderState(order.value))
const ticker = ref(-1)

const qrCodeContainer = ref<HTMLDivElement>()

const launchTicker = () => {
  ticker.value = window.setInterval(() => {
    remainSeconds.value = orders.getOrderState(order.value)
    if (!orders.validateOrder(order.value)) {
      window.clearInterval(ticker.value)
      ticker.value = -1
    }
  }, 1000)
}

onMounted(() => {
  if (!order.value) {
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
      launchTicker()
    })
  }
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})

const onPaymentCompletedClick = () => {
  // TODO
}

const onPayLaterClick = () => {
  // TODO
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
</style>
