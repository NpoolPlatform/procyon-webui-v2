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
              :default='false'
            />
            <label>{{ $t('MSG_BALANCE') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUSD'>
              <span class='number'>{{ utils.getLocaleString(balance) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ utils.getLocaleString(general.coinBalance(undefined, logined.loginedUserID, coinTypeID)) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;({{ $t("MSG_APPROX") }}</span>
              <span class='small number'>{{ utils.getLocaleString(balance) }}</span>
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
              :max='purchaseLimit'
              @focus='onPurchaseAmountFocusIn'
              @blur='onPurchaseAmountFocusOut'
            />
            <label>{{ $t('MSG_DUE_AMOUNT') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUSD'>
              <span class='number'>{{ utils.getLocaleString(paymentAmount) }}</span>
              <span class='unit'>USDT</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ utils.getLocaleString(usdToOtherAmount) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;(</span>
              <span class='number small'>{{ utils.getLocaleString(paymentAmount) }}</span>
              <span class='unit small'>USDT</span>
              <span>)</span>
            </div>
            <div class='warning' v-if='paymentCoin?.Unit === "BTC"'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
            </div>
            <div class='warning warning-pink' v-if='sdk.appPowerRental.description(target?.AppGoodID as string, 2)?.length > 0'>
              <img src='font-awesome/warning.svg'>
              <span v-html='$t(sdk.appPowerRental.description(target?.AppGoodID as string, 2))' />
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
                :disabled='!(target?.AppGoodPurchasable && target?.GoodPurchasable) || !sdk.appPowerRental.canBuy(target?.AppGoodID) || reachedPurchaseLimit || submitting || insufficientFunds || purchaseAmountError || usedToOtherAmountISNaN'
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
import { order, notify, ledger, appcoin, coincurrency, utils, user, coincurrencybase, sdk } from 'src/npoolstore'
import { PaymentBalance } from 'src/npoolstore/order/payment'
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
  appGoodID: string
  purchaseAmount: number
  coinTypeID: string
}

const router = useRouter()
const route = useRoute()

const query = computed(() => route.query as unknown as Query)
const appGoodID = computed(() => query.value.appGoodID)
const coinTypeID = ref(query.value.coinTypeID)

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.payableCoins().filter((el) => el.ENV === target.value?.CoinEnv))
const paymentCoin = computed(() => coin.coin(undefined, coinTypeID.value))

const target = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value))
const purchaseLimit = computed(() => sdk.appPowerRental.purchaseLimit(appGoodID.value))
const logined = user.useLocalUserStore()

const reachedPurchaseLimit = computed(() => (purchaseLimit.value + Number(purchaseAmount.value)) > Number(target?.value?.MaxUserAmount))

const selectedCoinCurrency = ref(1) // 币种汇率
const general = ledger.useLedgerStore()
const balance = computed(() => parseFloat((Number(general.coinBalance(undefined, logined.loginedUserID as string, coinTypeID.value)) * selectedCoinCurrency.value).toFixed(4)))

const purchaseAmount = ref(query.value.purchaseAmount) // 购买数量
const paymentAmount = computed(() => Number(sdk.appPowerRental.appPowerRental(appGoodID.value)?.UnitPrice) * purchaseAmount.value) // 支付金额
const usdToOtherAmount = computed(() => parseFloat((Math.ceil(paymentAmount.value / selectedCoinCurrency.value * 10000) / 10000).toFixed(4)))
const usedToOtherAmountISNaN = computed(() => isNaN(usdToOtherAmount.value))
const insufficientFunds = computed(() => balance.value < paymentAmount.value)

const message = computed(() => {
  if (purchaseAmount.value <= 0 || purchaseAmount.value > purchaseLimit.value) {
    return t('MSG_AMOUNT_TIP', { MAX: purchaseLimit.value })
  }
  if (purchaseAmount.value?.toString().includes('.')) {
    return t('MSG_NOT_SUPPORT_FLOAT_VALUE')
  }
  if (reachedPurchaseLimit.value) {
    return t('MSG_USER_TOTAL_PURCHASE_LIMIT', { MAX: parseFloat(target.value?.MaxUserAmount || '0') })
  }
  return ''
})

const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 ||
                              purchaseAmount.value > purchaseLimit.value ||
                              purchaseAmount.value?.toString().includes('.') ||
                              reachedPurchaseLimit.value
}

const submitting = ref(false)
const onPurchaseClick = () => {
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  submitting.value = true
  sdk.powerRentalOrder.createPowerRentalOrder({
    AppGoodID: appGoodID.value,
    Units: `${purchaseAmount.value}`,
    Balances: [{ CoinTypeID: coinTypeID.value, Amount: `${usdToOtherAmount.value}` } as PaymentBalance],
    InvestmentType: order.InvestmentType.FullPayment,
    FeeAppGoodIDs: target.value?.Requireds?.map((el) => el.RequiredAppGoodID) as Array<string>,
    AppGoodStockID: target.value?.AppGoodStockID as string
  }, (error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    sdk.powerRentalOrder.resetPowerRentalOrders()
    general.$reset()
    void router.push({
      path: '/dashboard'
    })
  })
}

const goWallet = () => {
  void router.push({ path: '/wallet' })
}

const currency = coincurrency.useCurrencyStore()

// 币种汇率优先级
const setCurrency = () => {
  if (coin.stableUSD(undefined, coinTypeID.value)) {
    selectedCoinCurrency.value = 1
    return
  }
  if (coin.getCurrency(undefined, coinTypeID.value) > 0) {
    selectedCoinCurrency.value = coin.getCurrency(undefined, coinTypeID.value)
    return
  }
  if (currency.currency(coinTypeID.value) > 0) {
    selectedCoinCurrency.value = currency.currency(coinTypeID.value)
    return
  }
  selectedCoinCurrency.value = undefined as unknown as number // can't buy
}

watch(coinTypeID, () => {
  getCoinCurrency(coinTypeID.value)
})

onMounted(() => {
  if (!general.ledgers(undefined, logined.loginedUserID).length) {
    getGenerals(0, 100)
  }
  if (!target.value) {
    sdk.appPowerRental.getAppPowerRental(appGoodID.value, () => {
      onPurchaseAmountFocusOut()
    })
  }

  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }

  if (coins.value.length > 0) {
    setCurrency()
  }

  if (!currency.currencies().length) {
    getCurrencies(0, 500)
  }

  sdk.powerRentalOrder.resetPowerRentalOrders()
  if (!sdk.powerRentalOrder.powerRentalOrders.value.length) {
    sdk.powerRentalOrder.getMyPowerRentalOrders(0, 0)
  }

  getCoinCurrency(coinTypeID.value)
})

const getGenerals = (offset:number, limit: number) => {
  general.getLedgers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL'),
        Message: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<ledger.Ledger>) => {
    if (error || !rows?.length) {
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
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcoin.AppCoin>) => {
    if (error || !rows?.length) {
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
  }, (error: boolean, rows: Array<coincurrencybase.CoinCurrency>) => {
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
