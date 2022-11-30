<template>
  <BackPage>
    <div class='content'>
      <div class='form-container content-glass'>
        <h3>{{ $t('MSG_ALEO_MINING_PURCHASE') }}</h3>
        <div class='info-flex'>
          <form action='javascript:void(0)'>
            <label>{{ $t('MSG_SELECT_PAYMENT_CURRENCY') }}</label>
            <CoinSelector
              v-model:id='coinTypeID'
              :coins='coins'
              label=''
              hide-label
            />
            <label>{{ $t('MSG_BALANCE') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUsd'>
              <span class='number'>{{ parseFloat(usdBalance.toFixed(4)) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ general.getBalanceByID(coinTypeID) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;({{ $t("MSG_APPROX") }}</span>
              <span class='small number'>{{ parseFloat(usdBalance.toFixed(4)) }}</span>
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
              :message='$t("MSG_AMOUNT_TIP", {MAX: total})'
              placeholder='MSG_AMOUNT_PLACEHOLDER'
              :min='1'
              :max='total'
              @focus='onPurchaseAmountFocusIn'
              @blur='onPurchaseAmountFocusOut'
            />
            <label>{{ $t('MSG_ALEO_DUE_AMOUNT') }}</label>
            <div class='three-section' v-if='paymentCoin?.StableUsd'>
              <span class='number'>{{ paymentAmount }}</span>
              <span class='unit'>USDT</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ parseFloat(usdToOtherAmount) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
              <span>&nbsp;(</span>
              <span class='number small'>{{ paymentAmount }}</span>
              <span class='unit small'>USDT</span>
              <span>)</span>
            </div>
            <div class='warning' v-if='paymentCoin?.Unit === "BTC"'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
            </div>
            <div class='warning warning-pink' v-if='insufficientFunds'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t("MSG_INSUFFICIENT_FUNDS") }} {{ $t("MSG_INSUFFICIENT_FUNDS_INFO") }}</span>
            </div>
            <div class='submit-container'>
              <WaitingBtn
                label='MSG_ALEO_PURCHASE'
                type='submit'
                :class='[insufficientFunds ? "submit-gray" : "", "submit"]'
                :disabled='submitting || insufficientFunds || purchaseAmountError'
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
  useAdminCurrencyStore
} from 'npool-cli-v4'
import { getCurrencies } from 'src/api/chain'
import { DefaultGoodID } from 'src/const/const'
import { defineAsyncComponent, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))

interface Query {
  goodID: string;
  purchaseAmount: number;
  coinTypeID: string;
}

const router = useRouter()
const route = useRoute()

const query = computed(() => route.query as unknown as Query)
const goodID = computed(() => query.value.goodID?.length ? query.value.goodID : DefaultGoodID)
const purchaseAmount = ref(query.value.purchaseAmount)
const coinTypeID = ref(query.value.coinTypeID)

const coin = useAdminAppCoinStore()
const coins = computed(() => coin.getAvailableCoins().filter((el) => el.ENV === target.value?.CoinEnv))
const paymentCoin = computed(() => coin.getCoinByID(coinTypeID.value))

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodID.value) as AppGood)
const goodPrice = computed(() => good.getPrice(goodID.value))
const total = computed(() => good.getPurchaseLimit(target.value))

const paymentAmount = computed(() => Number(goodPrice.value) * purchaseAmount.value)

const selectedCoinCurrency = ref(1)

const general = useFrontendGeneralStore()
const usdBalance = computed(() => Number(general.getBalanceByID(coinTypeID.value)) * selectedCoinCurrency.value)
const usdToOtherAmount = computed(() => (Math.ceil(paymentAmount.value / selectedCoinCurrency.value * 10000) / 10000).toFixed(4))
const insufficientFunds = computed(() => usdBalance.value < paymentAmount.value)

const order = useFrontendOrderStore()
const submitting = ref(false)

const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 || purchaseAmount.value > total.value
}

const onPurchaseClick = () => {
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  submitting.value = true
  order.createOrder({
    GoodID: goodID.value,
    Units: purchaseAmount.value,
    PaymentCoinID: coinTypeID.value,
    PayWithBalanceAmount: `${paymentAmount.value}`,
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
  }, (g: Array<General>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getGenerals(limit + offset, limit)
  })
}

const currency = useAdminCurrencyStore()
const setCurrency = () => {
  if (coin.haveCurrency(coinTypeID.value)) {
    selectedCoinCurrency.value = coin.getCurrency(coinTypeID.value) as number
    console.log('AppCoin: ', selectedCoinCurrency.value)
    return
  }
  if (!currency.getCurrency(coinTypeID.value)) {
    console.log('fail get currency')
    return
  }
  selectedCoinCurrency.value = parseFloat(currency.getCurrency(coinTypeID.value)?.MarketValueLow as string)
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

onMounted(() => {
  general.$reset()
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
    })
  }

  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }

  if (coins.value.length > 0) {
    setCurrency()
  }

  if (currency.Currencies.Currencies.length === 0) {
    getCurrencies(0, 100)
  }
})

</script>
