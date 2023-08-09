<template>
  <BackPage>
    <div class='content'>
      <div class='form-container content-glass'>
        <h3>{{ $t('MSG_MINING_PURCHASE') }}</h3>
        <div class='info-flex'>
          <form action='javascript:void(0)'>
            <label>{{ $t('MSG_SELECT_PAYMENT_CURRENCY') }}</label>
            <CoinSelector
              v-model:id='coinTypeID'
              :coins='coins'
              label=''
              hide-label
              :tip-index='1'
              :name-index='1'
            />
            <label>{{ $t('MSG_BALANCE') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUSD'>
              <span class='number'>{{ util.getLocaleString(balance) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ util.getLocaleString(general.getBalanceByID(coinTypeID)) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;({{ $t("MSG_APPROX") }}</span>
              <span class='small number'>{{ util.getLocaleString(balance) }}</span>
              <span class='small unit'>USDT</span>
              <span>)</span>
            </div>
            <label>{{ $t('MSG_PURCHASE_AMOUNT') }}</label>
            <Input
              v-model:value='purchaseAmount'
              type='number'
              id='amount'
              required
              :error='purchaseAmountError'
              :message='message'
              placeholder='MSG_AMOUNT_PLACEHOLDER'
              :min='1'
              :max='total'
              @focus='onPurchaseAmountFocusIn'
              @blur='onPurchaseAmountFocusOut'
            />
            <label>{{ $t('MSG_DUE_AMOUNT') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUSD'>
              <span class='number'>{{ util.getLocaleString(paymentAmount) }}</span>
              <span class='unit'>USDT</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ util.getLocaleString(usdToOtherAmount) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;(</span>
              <span class='number small'>{{ util.getLocaleString(paymentAmount) }}</span>
              <span class='unit small'>USDT</span>
              <span>)</span>
            </div>
            <div class='warning' v-if='paymentCoin?.Unit === "BTC"'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
            </div>
            <div class='warning warning-pink' v-if='target?.Descriptions?.length > 2 && target?.Descriptions?.[2]?.length > 0'>
              <img src='font-awesome/warning.svg'>
              <span v-html='$t(target.Descriptions?.[2])' />
            </div>
            <div class='warning warning-pink' v-if='insufficientFunds'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t("MSG_INSUFFICIENT_FUNDS") }} {{ $t("MSG_INSUFFICIENT_FUNDS_INFO") }}</span>
            </div>
            <div class='submit-container'>
              <WaitingBtn
                label='MSG_PURCHASE'
                type='submit'
                :class='[insufficientFunds ? "submit-gray" : "", "submit"]'
                :disabled='!target?.EnablePurchase || !good.haveSale(target) || purchaseLimitable || submitting || insufficientFunds || purchaseAmountError || usedToOtherAmountISNaN'
                :waiting='submitting'
                @click='onPurchaseClick'
              />
            </div>
            <input type='submit' :value='$t("MSG_GO_WALLET")' class='submit submit-alt' @click='goWallet'>
          </form>
        </div>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>

import {
  useFrontendOrderStore,
  NotifyType,
  Order,
  useFrontendGeneralStore,
  General,
  useAdminAppGoodStore,
  AppGood,
  useAdminAppCoinStore,
  AppCoin,
  useAdminCurrencyStore,
  useLocaleStringStore,
  CoinCurrency
} from 'npool-cli-v4'
import { defineAsyncComponent, onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))

interface Query {
  goodID: string
  purchaseAmount: number
  coinTypeID: string
}

const router = useRouter()
const route = useRoute()

const query = computed(() => route.query as unknown as Query)
const goodID = computed(() => query.value.goodID)
const coinTypeID = ref(query.value.coinTypeID)

const util = useLocaleStringStore()

const coin = useAdminAppCoinStore()
const coins = computed(() => coin.getAvailableCoins().filter((el) => el.ENV === target.value?.CoinEnv))
const paymentCoin = computed(() => coin.getCoinByID(coinTypeID.value))

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodID.value) as AppGood)
const total = computed(() => good.getPurchaseLimit(target.value))

const order = useFrontendOrderStore()
const purchaseLimitable = computed(() => order.getPurchasedAmount(goodID.value) >= Number(target?.value?.UserPurchaseLimit) || (order.getPurchasedAmount(goodID.value) + Number(purchaseAmount.value)) > Number(target?.value?.UserPurchaseLimit))

const selectedCoinCurrency = ref(1) // 币种汇率
const general = useFrontendGeneralStore()
const balance = computed(() => parseFloat((Number(general.getBalanceByID(coinTypeID.value)) * selectedCoinCurrency.value).toFixed(4)))

const purchaseAmount = ref(query.value.purchaseAmount) // 购买数量
const paymentAmount = computed(() => Number(good.getPrice(goodID.value)) * purchaseAmount.value) // 支付金额
const usdToOtherAmount = computed(() => parseFloat((Math.ceil(paymentAmount.value / selectedCoinCurrency.value * 10000) / 10000).toFixed(4)))
const usedToOtherAmountISNaN = computed(() => isNaN(usdToOtherAmount.value))
const insufficientFunds = computed(() => balance.value < paymentAmount.value)

const message = computed(() => {
  if (purchaseAmount.value <= 0 || purchaseAmount.value > total.value) {
    return t('MSG_AMOUNT_TIP', { MAX: total.value })
  }
  if (purchaseAmount.value?.toString().includes('.')) {
    return t('MSG_NOT_SUPPORT_FLOAT_VALUE')
  }
  if (purchaseLimitable.value) {
    return t('MSG_USER_TOTAL_PURCHASE_LIMIT', { MAX: parseFloat(target.value?.UserPurchaseLimit) })
  }
  return ''
})

const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 || purchaseAmount.value > total.value || purchaseAmount.value?.toString().includes('.') || purchaseLimitable.value
}

const submitting = ref(false)
const onPurchaseClick = () => {
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  submitting.value = true
  order.createOrder({
    GoodID: goodID.value,
    Units: `${purchaseAmount.value}`,
    PaymentCoinID: coinTypeID.value,
    PayWithBalanceAmount: `${usdToOtherAmount.value}`,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (o: Order, error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    order.$reset()
    general.$reset()
    void router.push({
      path: '/dashboard'
    })
  })
}

const goWallet = () => {
  void router.push({ path: '/wallet' })
}

const currency = useAdminCurrencyStore()

// 币种汇率优先级
const setCurrency = () => {
  if (coin.stableCoin(coinTypeID.value)) {
    selectedCoinCurrency.value = 1
    console.log('stable coin: ', selectedCoinCurrency.value)
    return
  }
  if (coin.haveCurrency(coinTypeID.value)) {
    selectedCoinCurrency.value = coin.getCurrency(coinTypeID.value)
    console.log('AppCoin Currency: ', selectedCoinCurrency.value)
    return
  }
  if (currency.haveCurrency(coinTypeID.value)) {
    selectedCoinCurrency.value = parseFloat(currency.getCurrency(coinTypeID.value)?.MarketValueLow as string)
    console.log('Currency MarketValueLow: ', selectedCoinCurrency.value)
    return
  }
  selectedCoinCurrency.value = undefined as unknown as number // can't buy
}

watch(coinTypeID, () => {
  getCoinCurrency(coinTypeID.value)
})

onMounted(() => {
  if (general.Generals.Generals.length === 0) {
    getGenerals(0, 100)
  }
  if (!target.value) {
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
      onPurchaseAmountFocusOut()
    })
  }

  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }

  if (coins.value.length > 0) {
    setCurrency()
  }

  if (currency.Currencies.Currencies.length === 0) {
    getCurrencies(0, 500)
  }

  order.$reset()
  if (order.Orders.Orders.length === 0) {
    getOrders(0, 500)
  }

  getCoinCurrency(coinTypeID.value)
})

const getOrders = (offset:number, limit: number) => {
  order.getOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<Order>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getOrders(offset + limit, limit)
  })
}

const getGenerals = (offset:number, limit: number) => {
  general.getGenerals({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<General>) => {
    if (error || rows.length < limit) {
      return
    }
    getGenerals(limit + offset, limit)
  })
}
const getCoins = (offset: number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCoin>) => {
    if (error || rows.length < limit) {
      if (!error) setCurrency()
      return
    }
    getCoins(offset + limit, limit)
  })
}

const getCurrencies = (offset: number, limit: number) => {
  currency.getCurrencies({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<CoinCurrency>) => {
    if (error || rows.length <= 0) {
      if (!error) setCurrency()
      return
    }
    getCurrencies(offset + limit, limit)
  })
}

const getCoinCurrency = (coinTypeID: string) => {
  currency.getCoinCurrency({
    CoinTypeID: coinTypeID,
    Message: {}
  }, () => {
    setCurrency()
  })
}
</script>
