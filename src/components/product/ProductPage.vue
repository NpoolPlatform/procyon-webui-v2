<template>
  <div :class='[ showBalanceDialog ? "blur" : "" ]'>
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
                    <!-- {{ myCoin?.Unit }} ({{ currency.formatCoinName(myCoin?.Name as string) }}) -->
                    {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : currency.formatCoinName(myCoin?.Name as string) }})
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
              <form action='javascript:void(0)' id='purchase'>
                <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
                <Input
                  v-model:value='myPurchaseAmount'
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
                      {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : currency.formatCoinName(myCoin?.Name as string) }})
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
              <span class='number'>{{ getUserBalance.toFixed(4) }}</span>
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
                :max='Math.min(getUserBalance, totalAmount)'
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
            <button @click='onSubmit' :disabled='inputBalance < 0 || inputBalance > getUserBalance || inputBalance > (Math.ceil(totalAmount * 10000) / 10000)'>
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
  useGoodStore,
  NotificationType,
  useCurrencyStore,
  useStockStore,
  useLoginedUserStore,
  Currency
} from 'npool-cli-v2'
import { defineAsyncComponent, defineProps, toRef, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { throttle } from 'quasar'
import { ThrottleSeconds } from 'src/const/const'
import { useRouter } from 'vue-router'

import warning from 'src/assets/warning.svg'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { useLocalOrderStore } from 'src/teststore/mock/order'

const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const remainOrderAmount = computed(() => {
  const value = Math.ceil(totalAmount.value * 10000) / 10000 - inputBalance.value
  if (value < 0) {
    return 0
  }
  return value
})
interface Props {
  goodId: string;
  projectClass: string;
  bgImg: string;
  customizeInfo?: boolean;
  purchaseAmount?: number;
}

const showBalanceDialog = ref(false)
const general = useGeneralStore()
const getUserBalance = computed(() => {
  return general.getCoinBalance(paymentCoin.value?.ID as string)
})
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
        !paymentCoin.value?.Unit?.includes('BUSD')
})

const coin = useCoinStore()
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale && coin.ENV === good.value?.Main?.ENV))
const selectedCoinID = ref(undefined as unknown as string)

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))
const myPurchaseAmount = ref(purchaseAmount.value ? purchaseAmount.value : 1)

const selectedCoinCurrency = ref(1)
const totalAmount = computed(() => good.value?.Good?.Good?.Price * myPurchaseAmount.value / selectedCoinCurrency.value)

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

const stock = useStockStore()
const total = computed(() => {
  const total1 = stock.getStockByGoodID(goodId.value)?.Total
  let total2 = total1
  const index = goods.AppGoods.findIndex((el) => el.GoodID === goodId.value)
  if (index >= 0) {
    total2 = goods.AppGoods[index].PurchaseLimit
  }
  return total1 > total2 ? total2 : total1
})

const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.Main?.ID as string, usedFor.value))

const currency = useCurrencyStore()
const inputBalance = ref(0)
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

const purchaseAmountError = ref(false)
// const balanceAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = myPurchaseAmount.value <= 0 || myPurchaseAmount.value > total.value
}

const submitting = ref(false)

const router = useRouter()
const logined = useLoginedUserStore()
const order = useLocalOrderStore()

const getUserGenerals = (offset:number, limit: number) => {
  submitting.value = true
  general.getGenerals({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    submitting.value = false
    if (error) {
      return
    }
    if (count === 0) {
      createOrder()
      return
    }
    getUserGenerals(limit + offset, limit)
  })
}
const createOrder = () => {
  if (getUserBalance.value <= 0) {
    onSubmit()
  } else {
    inputBalance.value = 0 // reset value
    showBalanceDialog.value = true
  }
}

const getOrders = (offset:number, limit: number) => {
  order.getOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    if (error || count === 0) {
      return
    }
    getOrders(offset + limit, limit)
  })
}

const localOrder = useLocalOrderStore()
const onSubmit = () => {
  showBalanceDialog.value = false
  submitting.value = true

  localOrder.createOrder({
    GoodID: goodId.value,
    Units: myPurchaseAmount.value,
    PaymentCoinID: paymentCoin.value?.ID as string,
    PayWithBalanceAmount: `${inputBalance.value}`,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (orderId: string, paymentId: string, error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }

    getOrders(0, 100)

    void router.push({
      path: '/payment',
      query: {
        orderId: orderId
      }
    })
  })
}
const onMenuHide = () => {
  showBalanceDialog.value = false
}

const onPurchaseClick = throttle(() => {
  if (!logined.getLogined) {
    void router.push({
      path: '/signin',
      query: {
        target: '/product/aleo',
        goodId: good.value.Good.Good.ID as string,
        purchaseAmount: myPurchaseAmount.value
      }
    })
    return
  }
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  getUserGenerals(0, 100)
}, ThrottleSeconds * 1000)

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

</script>

<style lang='sass' scoped>
</style>
