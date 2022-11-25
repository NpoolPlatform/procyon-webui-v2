<template>
  <BackPage>
    <div class='content'>
      <div class='form-container content-glass'>
        <h3>{{ $t('MSG_ALEO_MINING_PURCHASE') }}</h3>
        <div class='info-flex'>
          <form action='javascript:void(0)'>
            <label>{{ $t('MSG_SELECT_PAYMENT_CURRENCY') }}</label>
            <select :name='$t("MSG_PAYMENT_METHOD")' v-model='selectedCoin' required>
              <option
                v-for='myCoin in coins'
                :key='myCoin?.ID'
                :value='myCoin'
                :selected='selectedCoin?.ID === myCoin?.ID'
              >
                {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : coinName(myCoin) }})
              </option>
            </select>
            <label>{{ $t('MSG_BALANCE') }}</label>
            <div class='three-section' v-if='isUSDCoin'>
              <span class='number'>{{ parseFloat(usdBalance.toFixed(4)) }}</span>
              <span class='unit'>{{ selectedCoin?.Unit }}</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ general.getBalanceByID(coinTypeID) }}</span>
              <span class='unit'>{{ selectedCoin?.Unit }}</span>
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
            <div class='three-section' v-if='isUSDCoin'>
              <span class='number'>{{ paymentAmount }}</span>
              <span class='unit'>USDT</span>
            </div>
            <div class='three-section' v-else>
              <span class='number'>{{ parseFloat(usdToOtherAmount) }}</span>
              <span class='unit'>{{ selectedCoin?.Unit }}</span>
              <span>&nbsp;(</span>
              <span class='number small'>{{ paymentAmount }}</span>
              <span class='unit small'>USDT</span>
              <span>)</span>
            </div>
            <div class='warning' v-if='selectedCoin?.Unit === "BTC"'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: selectedCoin?.Unit }) }}</span>
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
  Coin,
  Currency,
  NotificationType,
  PriceCoinName,
  useAdminOracleStore,
  useCoinStore,
  useCurrencyStore
} from 'npool-cli-v2'
import {
  useFrontendOrderStore,
  NotifyType,
  Order,
  useFrontendGeneralStore,
  General,
  useAdminAppGoodStore,
  AppGood
} from 'npool-cli-v4'
import { DefaultGoodID } from 'src/const/const'
import { defineAsyncComponent, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

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

const coin = useCoinStore()
const coins = computed(() => {
  const trc20Coins = [] as Array<Coin>
  const erc20Coins = [] as Array<Coin>
  const btcCoins = [] as Array<Coin>
  const busdCoins = [] as Array<Coin>

  coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale && coin.ENV === targetGood.value?.CoinEnv).forEach((el) => {
    if (el.Name?.toLowerCase()?.includes('trc20')) {
      trc20Coins.push(el)
    } else if (el.Unit?.includes('BUSD')) {
      busdCoins.push(el)
    } else if (el.Unit?.includes('BTC')) {
      btcCoins.push(el)
    } else {
      erc20Coins.push(el)
    }
  })

  trc20Coins.push(...erc20Coins)
  trc20Coins.push(...btcCoins)
  trc20Coins.push(...busdCoins)

  return trc20Coins
})

const currency = useCurrencyStore()

const selectedCoin = computed({
  get: () => {
    const myCoin = coin.getCoinByID(coinTypeID.value)
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
    coinTypeID.value = val?.ID as string
    if (currencyFromOracle.value) {
      selectedCoinCurrency.value = Math.min(currencyFromOracle.value.AppPriceVSUSDT, currencyFromOracle.value.PriceVSUSDT)
      return
    }
    currency.getCoinCurrency(coin.getCoinByID(coinTypeID.value), Currency.USD, (usdCurrency: number) => {
      if (usdCurrency > 0) {
        selectedCoinCurrency.value = usdCurrency
      }
    })
  }
})

const coinName = (c: Coin) => {
  if (c.Unit?.includes('BUSD')) {
    return 'BEP20'
  } else if (c.Name?.toLowerCase()?.includes('erc20')) {
    return 'ERC20'
  } else if (c.Name?.toLowerCase()?.includes('trc20')) {
    return 'TRC20'
  }
  return currency.formatCoinName(c.Name as string)
}
const isUSDCoin = computed(() => selectedCoin.value?.Unit?.includes('USD'))

const good = useAdminAppGoodStore()
const targetGood = computed(() => good.getGoodByID(goodID.value) as AppGood)
const goodPrice = computed(() => good.getPriceByID(goodID.value))

const total = computed(() => Math.min(targetGood.value?.PurchaseLimit, targetGood.value?.Total))
const paymentAmount = computed(() => Number(goodPrice.value) * purchaseAmount.value)

const selectedCoinCurrency = ref(1)

const general = useFrontendGeneralStore()
const usdBalance = computed(() => Number(general.getBalanceByID(coinTypeID.value)) * selectedCoinCurrency.value)
const usdToOtherAmount = computed(() => (Math.ceil(paymentAmount.value / selectedCoinCurrency.value * 10000) / 10000).toFixed(4))
const insufficientFunds = computed(() => usdBalance.value < paymentAmount.value)

const oracle = useAdminOracleStore()
const currencyFromOracle = computed(() => oracle.getCurrencyByID(coinTypeID.value))

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

onMounted(() => {
  general.$reset()
  if (general.Generals.Generals.length === 0) {
    getGenerals(0, 100)
  }
  if (!targetGood.value) {
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

  if (oracle.Currencies.length === 0) {
    oracle.getCurrencies({
      Message: {}
    }, () => {
      // TODO
    })
  }

  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      currency.getAllCoinCurrencies({
        Currencies: [Currency.USD],
        Message: {
          Error: {
            Title: t('MSG_GET_CURRENCIES'),
            Message: t('MSG_GET_CURRENCIES_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        // TODO
      })
      if (currencyFromOracle.value) {
        selectedCoinCurrency.value = Math.min(currencyFromOracle.value.AppPriceVSUSDT, currencyFromOracle.value.PriceVSUSDT)
        return
      }
      currency.getCoinCurrency(coin.getCoinByID(coinTypeID.value), Currency.USD, (usdCurrency: number) => {
        if (usdCurrency > 0) {
          selectedCoinCurrency.value = usdCurrency
        }
      })
    })
  }
  if (coins.value.length > 0) {
    if (currencyFromOracle.value) {
      selectedCoinCurrency.value = Math.min(currencyFromOracle.value.AppPriceVSUSDT, currencyFromOracle.value.PriceVSUSDT)
      return
    }
    currency.getCoinCurrency(coin.getCoinByID(coinTypeID.value), Currency.USD, (usdCurrency: number) => {
      if (usdCurrency > 0) {
        selectedCoinCurrency.value = usdCurrency
      }
    })
  }
})

</script>
