<template>
  <div class='content order-page' v-if='showMe'>
    <div :class='[ "product-container content-glass project", projectClass ]'>
      <div class='product-title-section project-title-section' :style='{"background-image": "url(" + bgImg + ")"}'>
        <div class='product-title-container'>
          <div class='product-page-icon'>
            <img :src='target?.CoinLogo'>
          </div>
          <h1 v-html='$t(sdk.appPowerRental.displayName(target?.AppGoodID as string, 1))' />
        </div>
      </div>
      <!-- mobile start -->
      <div id='product-form' class='product-sidebar-section mobile'>
        <h3 class='form-title'>
          {{ $t('MSG_MINING_PURCHASE') }}
        </h3>
        <form action='javascript:void(0)' id='purchase'>
          <div class='full-section' v-if='sdk.appPowerRental.canBuy(target?.AppGoodID as string) '>
            <h4>{{ $t("MSG_IRON_FISH_SALE_END_DATE2") }}</h4>
            <span class='number'>{{ remainDays }}</span>
            <span class='unit'> {{ $t("MSG_DAYS") }} </span>
            <span class='number'>{{ remainHours }}</span>
            <span class='unit'>{{ $t("MSG_HOURS") }} </span>
            <span class='number'>{{ remainMinutes }}</span>

            <span class='unit'>{{ $t("MSG_MINUTES") }} </span>
          </div>
          <br>
          <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
          <Input
            v-model:value='myPurchaseAmount'
            type='number'
            id='amount'
            required
            :error='purchaseAmountError'
            :message='$t("MSG_AMOUNT_TIP", {MAX: total})'
            placeholder='MSG_AMOUNT_PLACEHOLDER'
            :min='1'
            :max='total'
            @focus='onPurchaseAmountFocusIn'
            @blur='onPurchaseAmountFocusOut'
          />
          <div class='warning iron-fish-warning' v-if='showIronFishWarning && target?.Descriptions?.[2]'>
            <img src='font-awesome/warning.svg'>
            <span v-html='$t(sdk.appPowerRental.description(target?.AppGoodID, 2))' />
          </div>
          <br>
          <h4>{{ $t('MSG_PAYMENT_METHOD') }}</h4>
          <CoinSelector
            v-model:id='selectedCoinID'
            :coins='coins'
            label=''
            hide-label
            default
            :tip-index='1'
            :name-index='1'
          />
          <div class='warning' v-if='showRateTip'>
            <img :src='warning'>
            <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
          </div>
          <div class='warning' v-if='showBUSDTip'>
            <img :src='warning'>
            <span>{{ $t('MSG_COIN_BUSD_PAYMENT_TIP') }}</span>
          </div>
          <div class='submit-container'>
            <WaitingBtn
              label='MSG_IRON_FISH_PURCHASE'
              type='submit'
              class='submit-btn'
              :disabled='submitting || !sdk.appPowerRental.enablePurchase(target?.AppGoodID as string)'
              :waiting='submitting'
              @click='onPurchaseClick'
            />
          </div>
        </form>
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
      </div>
      <!-- pc start -->
      <div class='product-sidebar'>
        <div id='product-form' class='product-sidebar-section'>
          <h3 class='form-title'>
            {{ $t('MSG_MINING_PURCHASE') }}
          </h3>
          <form action='javascript:void(0)' id='purchase'>
            <div class='full-section' v-if='sdk.appPowerRental.canBuy(target?.AppGoodID as string)'>
              <h4>{{ $t("MSG_IRON_FISH_SALE_END_DATE2") }}</h4>
              <span class='number'>{{ remainDays }}</span>
              <span class='unit'> {{ $t("MSG_DAYS") }} </span>
              <span class='number'>{{ remainHours }}</span>
              <span class='unit'>{{ $t("MSG_HOURS") }} </span>
              <span class='number'>{{ remainMinutes }}</span>
              <span class='unit'>{{ $t("MSG_MINUTES") }} </span>
            </div>
            <br>
            <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
            <Input
              v-model:value='myPurchaseAmount'
              type='number'
              id='amount'
              required
              :error='purchaseAmountError'
              :message='$t("MSG_AMOUNT_TIP", {MAX: total})'
              placeholder='MSG_AMOUNT_PLACEHOLDER'
              :min='1'
              :max='total'
              @focus='onPurchaseAmountFocusIn'
              @blur='onPurchaseAmountFocusOut'
            />
            <div class='warning iron-fish-warning' v-if='showIronFishWarning && target?.Descriptions?.[2]'>
              <img src='font-awesome/warning.svg'>
              <span v-html='$t(sdk.appPowerRental.description(target?.AppGoodID, 2))' />
            </div>
            <br>
            <h4>{{ $t('MSG_PAYMENT_METHOD') }}</h4>
            <CoinSelector
              v-model:id='selectedCoinID'
              :coins='coins'
              label=''
              hide-label
              default
              :tip-index='1'
              :name-index='1'
            />
            <div class='warning' v-if='showRateTip'>
              <img :src='warning'>
              <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
            </div>
            <div class='warning' v-if='showBUSDTip'>
              <img :src='warning'>
              <span>{{ $t('MSG_COIN_BUSD_PAYMENT_TIP') }}</span>
            </div>
            <div class='submit-container'>
              <WaitingBtn
                label='MSG_IRON_FISH_PURCHASE'
                type='submit'
                class='submit-btn'
                :disabled='submitting || !sdk.appPowerRental.enablePurchase(target?.AppGoodID as string)'
                :waiting='submitting'
                @click='onPurchaseClick'
              />
            </div>
          </form>
        </div>
        <slot name='sidebar' />
      </div>
    </div>
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, defineProps, toRef, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import warning from 'src/assets/warning.svg'
import { constant, appcoin, ledger, user, sdk } from 'src/npoolstore'
import { getCoins } from 'src/api/chain'

const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
// const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

interface Props {
  appGoodID: string
  projectClass: string
  bgImg: string
  customizeInfo?: boolean
  purchaseAmount?: number
}

const props = defineProps<Props>()
const appGoodID = toRef(props, 'appGoodID')
const projectClass = toRef(props, 'projectClass')
const bgImg = toRef(props, 'bgImg')
const customizeInfo = toRef(props, 'customizeInfo')
const purchaseAmount = toRef(props, 'purchaseAmount')

const router = useRouter()

const logined = user.useLocalUserStore()
const general = ledger.useLedgerStore()

const target = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value))
const total = computed(() => sdk.appPowerRental.purchaseLimit(appGoodID.value))

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.payableCoins().filter((el) => el.ENV === target.value?.CoinEnv))

const defaultCoinTypeID = computed(() => {
  return coins.value?.length > 0 ? coins.value?.[0].CoinTypeID : undefined as unknown as string
})
const selectedCoinID = ref(defaultCoinTypeID.value)
const paymentCoin = computed(() => coin.coin(undefined, selectedCoinID.value))

const showIronFishWarning = computed(() => sdk.appPowerRental.description(target.value?.AppGoodID as string, 2).length)
const showRateTip = computed(() => {
  return paymentCoin.value?.Unit?.length &&
        !paymentCoin.value?.Unit?.includes(constant.PriceCoinName) &&
        !paymentCoin.value?.Name?.includes(constant.PriceCoinName) &&
        !paymentCoin.value?.Unit?.includes('BUSD') &&
        !paymentCoin.value?.Unit?.includes('USDC')
})

const showBUSDTip = computed(() => {
  return paymentCoin.value?.Unit?.includes('BUSD')
})

const myPurchaseAmount = ref(purchaseAmount.value ? purchaseAmount.value : 1)
const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = myPurchaseAmount.value <= 0 || myPurchaseAmount.value > total.value
}

const submitting = ref(false)

const onPurchaseClick = () => {
  if (!logined.logined) {
    void router.push({
      path: '/signin',
      query: {
        target: '/product/ironfish',
        appGoodID: target.value?.AppGoodID,
        purchaseAmount: myPurchaseAmount.value
      }
    })
    return
  }
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  general.$reset()
  void router.push({
    path: '/payment',
    query: {
      appGoodID: target.value?.AppGoodID,
      coinTypeID: selectedCoinID.value,
      purchaseAmount: myPurchaseAmount.value
    }
  })
}

const goIndexPage = () => {
  if (!target.value?.EnableProductPage) {
    void router.push({ path: '/' })
  }
}

const endTime = computed(() => target.value?.SaleEndAt)
const ticker = ref(-1)
const remainDays = ref(27)
const remainHours = ref(23)
const remainMinutes = ref(59)
const remainSeconds = ref(59)

const showMe = ref(false)

watch(target, () => {
  if (!target.value) {
    return
  }
  if (target.value && !target.value.EnableProductPage) {
    goIndexPage()
    return
  }

  showMe.value = true
})

onMounted(() => {
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }

  if (target.value && !target.value.EnableProductPage) {
    goIndexPage()
    return
  }

  if (target.value && target.value.EnableProductPage) {
    showMe.value = true
  }

  ticker.value = window.setInterval(() => {
    const now = Math.floor(Date.now() / 1000)
    const remain = endTime.value as number - now >= 0 ? endTime.value as number - now : 0
    remainDays.value = Math.floor(remain / 24 / 60 / 60)
    remainHours.value = Math.floor((remain - remainDays.value * 24 * 60 * 60) / 60 / 60)
    remainMinutes.value = Math.floor((remain - remainDays.value * 24 * 60 * 60 - remainHours.value * 60 * 60) / 60)
    remainSeconds.value = remain - remainDays.value * 24 * 60 * 60 - remainHours.value * 60 * 60 - remainMinutes.value * 60
    if (remainDays.value > 99) {
      remainDays.value = 99
    }
  }, 1000)
})

onUnmounted(() => {
  if (ticker.value >= 0) {
    window.clearInterval(ticker.value)
  }
})
</script>

<style lang='sass' scoped>
</style>
