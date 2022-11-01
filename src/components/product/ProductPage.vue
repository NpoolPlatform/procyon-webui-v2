<template>
  <div :class='[ showBalanceDialog ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div :class='[ "product-container content-glass project", projectClass ]'>
          <div class='product-title-section project-title-section' :style='{"background-image": "url(" + bgImg + ")"}'>
            <div class='product-title-container'>
              <div class='product-page-icon'>
                <img :src='target?.CoinLogo'>
              </div>
              <h1>{{ target?.CoinName }} {{ $t('MSG_MINING') }}</h1>
            </div>
          </div>
          <div id='product-form' class='product-sidebar-section mobile'>
            <h3 class='form-title'>
              {{ $t('MSG_MINING_PURCHASE') }}
            </h3>
            <form action='javascript:void(0)' id='purchase'>
              <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
              <Input
                v-model:value='myPurchaseAmount'
                type='number'
                id='amount'
                required
                :error='purchaseAmountError'
                :message='$t("MSG_AMOUNT_TIP", {MAX: total})'
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
                    {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : coinName(myCoin) }})
                  </option>
                </select>
              </div>
              <div class='submit-container'>
                <WaitingBtn
                  label='MSG_PURCHASE'
                  type='submit'
                  class='submit-btn'
                  :disabled='submitting'
                  :waiting='submitting'
                  @click='onPurchaseClick'
                />
              </div>
              <div class='warning' v-if='showRateTip'>
                <img :src='warning'>
                <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
              </div>
              <div class='warning' v-if='showBUSDTip'>
                <img :src='warning'>
                <span>{{ $t('MSG_COIN_BUSD_PAYMENT_TIP') }}</span>
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
            <div v-else class='info-flex'>
              <div class='three-section'>
                <h4>{{ $t('MSG_PRICE') }}:</h4>
                <span class='number'>{{ target?.Price }}</span>
                <span class='unit'>{{ PriceCoinName }}</span>
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
                <span class='number'>*</span>
                <span class='unit'>{{ target?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
                <span class='number'>{{ target?.DurationDays }}</span>
                <span class='unit'>{{ $t('MSG_DAYS') }}</span>
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
                <span class='number'>20</span>
                <span class='unit'>%</span>
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
                <span class='number'>{{ formatTime(target?.StartAt, true) }}</span>
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
              <form action='javascript:void(0)' id='purchase'>
                <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
                <Input
                  v-model:value='myPurchaseAmount'
                  type='number'
                  id='amount'
                  required
                  :error='purchaseAmountError'
                  :message='$t("MSG_AMOUNT_TIP", {MAX: total})'
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
                      {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : coinName(myCoin) }})
                    </option>
                  </select>
                </div>
                <div class='submit-container'>
                  <WaitingBtn
                    label='MSG_PURCHASE'
                    type='submit'
                    class='submit-btn'
                    :disabled='submitting'
                    :waiting='submitting'
                    @click='onPurchaseClick'
                  />
                </div>
                <div class='warning' v-if='showRateTip'>
                  <img :src='warning'>
                  <span>{{ $t('MSG_COIN_USDT_EXCHANGE_RATE_TIP', { COIN_NAME: paymentCoin?.Unit }) }}</span>
                </div>
                <div class='warning' v-if='showBUSDTip'>
                  <img :src='warning'>
                  <span>{{ $t('MSG_COIN_BUSD_PAYMENT_TIP') }}</span>
                </div>
              </form>
            </div>
            <slot name='sidebar' />
          </div>
        </div>
        <div class='hr' />
      </div>
    </BackPage>
  </div>
  <q-dialog
    v-model='showBalanceDialog'
    maximized
    @hide='onMenuHide'
  >
    <div class='product-container content-glass popup-container plur'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_HAVE_UNSPENT_FUNDS') }}</h3>
            <div class='full-section'>
              <h4>{{ $t('MSG_AVAILABLE_BALANCE') }}</h4>
              <span class='number'>{{ balance.toFixed(4) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='hr' />
            <div class='full-section'>
              <h4>{{ $t('MSG_ORDER_DUE_AMOUNT') }}</h4>
              <span class='number'>{{ (Math.ceil(totalAmount * 10000) / 10000).toFixed(4) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='hr' />
            <div class='full-section'>
              <h4>{{ $t('MSG_USE_WALLET_BALANCE') }}</h4>
              <input
                type='number'
                :min='0'
                :max='Math.min(balance, totalAmount)'
                v-model='inputBalance'
              >
            </div>
            <div class='full-section'>
              <h4>{{ $t('MSG_REMAINING_DUE_AMOUNT') }}</h4>
              <span class='number'>{{ (Math.ceil(remainOrderAmount * 10000) / 10000).toFixed(4) }}</span>
              <span class='unit'>{{ paymentCoin?.Unit }}</span>
            </div>
            <div class='warning'>
              <img src='font-awesome/warning.svg'>
              <span>{{ $t('MSG_PAY_THE_REMAINDER') }}</span>
            </div>
            <button @click='onSubmit' :disabled='inputBalance < 0 || inputBalance > balance || inputBalance > (Math.ceil(totalAmount * 10000) / 10000)'>
              {{ $t('MSG_CONTINUE2') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  formatTime,
  PriceCoinName,
  CoinDescriptionUsedFor,
  useCoinStore,
  NotificationType,
  useCurrencyStore,
  Currency,
  Coin
} from 'npool-cli-v2'
import { defineAsyncComponent, defineProps, toRef, ref, computed, onMounted } from 'vue'
import { throttle } from 'quasar'
import { ThrottleSeconds } from 'src/const/const'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  AppGood,
  General,
  KYCState,
  NotifyType,
  Order,
  useAdminAppGoodStore,
  useFrontendGeneralStore,
  useFrontendKYCStore,
  useFrontendOrderStore,
  useLocalUserStore
} from 'npool-cli-v4'

import warning from 'src/assets/warning.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

interface Props {
  goodId: string;
  projectClass: string;
  bgImg: string;
  customizeInfo?: boolean;
  purchaseAmount?: number;
}

const props = defineProps<Props>()
const goodId = toRef(props, 'goodId')
const projectClass = toRef(props, 'projectClass')
const bgImg = toRef(props, 'bgImg')
const customizeInfo = toRef(props, 'customizeInfo')
const purchaseAmount = toRef(props, 'purchaseAmount')

const showRateTip = computed(() => {
  return paymentCoin.value?.Unit?.length &&
        !paymentCoin.value?.Unit?.includes(PriceCoinName) &&
        !paymentCoin.value?.Name?.includes(PriceCoinName) &&
        !paymentCoin.value?.Unit?.includes('BUSD') &&
        !paymentCoin.value?.Unit?.includes('USDC')
})

const showBUSDTip = computed(() => {
  return paymentCoin.value?.Unit?.includes('BUSD')
})

const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = myPurchaseAmount.value <= 0 || myPurchaseAmount.value > total.value
}

const coin = useCoinStore()
const coins = computed(() => {
  const trc20Coins = [] as Array<Coin>
  const erc20Coins = [] as Array<Coin>
  const btcCoins = [] as Array<Coin>
  const busdCoins = [] as Array<Coin>

  const targetCoin = coin.getCoinByID(target.value?.CoinTypeID)
  coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale && coin.ENV === targetCoin?.ENV).forEach((el) => {
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

const selectedCoinID = ref(undefined as unknown as string)

const good = useAdminAppGoodStore()
const target = computed(() => good.getGoodByID(goodId.value) as AppGood)
const myPurchaseAmount = ref(purchaseAmount.value ? purchaseAmount.value : 1)

const selectedCoinCurrency = ref(1)
const totalAmount = computed(() => Number(target.value?.Price) * myPurchaseAmount.value / selectedCoinCurrency.value)

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
    currency.getCoinCurrency(coin.getCoinByID(selectedCoinID.value), Currency.USD, (usdCurrency: number) => {
      if (usdCurrency > 0) {
        selectedCoinCurrency.value = usdCurrency
      }
    })
  }
})

const total = computed(() => Math.min(target.value?.PurchaseLimit, target.value?.Total))

const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(target.value?.CoinTypeID, usedFor.value))

const currency = useCurrencyStore()

const inputBalance = ref(0)
const general = useFrontendGeneralStore()
const balance = computed(() => {
  return Number(general.getBalanceByID(paymentCoin.value?.ID as string))
})

const showBalanceDialog = ref(false)

const submitting = ref(false)

const remainOrderAmount = computed(() => {
  const value = Math.ceil(totalAmount.value * 10000) / 10000 - inputBalance.value
  if (value < 0) {
    return 0
  }
  return value
})
const router = useRouter()
const logined = useLocalUserStore()
const order = useFrontendOrderStore()

const onMenuHide = () => {
  showBalanceDialog.value = false
}

const kyc = useFrontendKYCStore()
const onPurchaseClick = throttle(() => {
  if (!logined.logined) {
    void router.push({
      path: '/signin',
      query: {
        target: '/product/aleo',
        goodId: target.value.GoodID,
        purchaseAmount: myPurchaseAmount.value
      }
    })
    return
  }
  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    if (error || !kyc.KYC || kyc.KYC.State !== KYCState.Approved) {
      void router.push({ path: '/kyc' })
      return
    }
    onPurchaseAmountFocusOut()
    if (purchaseAmountError.value) {
      return
    }
    getGenerals(0, 100)
  })
}, ThrottleSeconds * 1000)

const getGenerals = (offset:number, limit: number) => {
  submitting.value = true
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
    submitting.value = false
    if (error) {
      return
    }
    if (g.length < limit) {
      createOrder()
      return
    }
    getGenerals(limit + offset, limit)
  })
}

const createOrder = () => {
  if (balance.value <= 0) {
    onSubmit()
  } else {
    inputBalance.value = 0
    showBalanceDialog.value = true
  }
}

const onSubmit = () => {
  showBalanceDialog.value = false
  submitting.value = true

  order.createOrder({
    GoodID: goodId.value,
    Units: myPurchaseAmount.value,
    PaymentCoinID: paymentCoin.value?.ID as string,
    PayWithBalanceAmount: `${inputBalance.value}`,
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
    void router.push({
      path: '/payment',
      query: {
        orderId: o.ID
      }
    })
  })
}

onMounted(() => {
  if (coins.value.length > 0) {
    selectedCoinID.value = coins.value[0].ID as string
    currency.getCoinCurrency(coin.getCoinByID(selectedCoinID.value), Currency.USD, (usdCurrency: number) => {
      console.log(usdCurrency)
      if (usdCurrency > 0) {
        selectedCoinCurrency.value = usdCurrency
      }
    })
  }
})

onMounted(() => {
  if (!target.value) {
    good.getAppGood({
      GoodID: goodId.value,
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
})

</script>

<style lang='sass' scoped>
</style>
