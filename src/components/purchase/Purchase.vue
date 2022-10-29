<template>
  <div :class='[ showBalanceDialog ? "blur" : "" ]'>
    <PurchasePage :good='good'>
      <div class='info'>
        <h3 class='form-title'>
          {{ $t('MSG_PRODUCT_DETAILS') }}
        </h3>
        <div class='info-flex'>
          <div class='three-section'>
            <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
            <span class='number'>*</span>
            <span class='unit'>{{ good?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
            <span class='number'>{{ good?.DurationDays }}</span>
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
            <span class='number'>20</span>
            <span class='unit'>%</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_MAINTENANCE_FEE') }}:</h4>
            <span class='number'>1.5</span>
            <span class='unit'>{{ PriceCoinName }} / {{ $t('MSG_DAY') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
            <span class='number'>{{ formatTime(good?.StartAt, true) }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_PRICE') }}:</h4>
            <span class='number'>{{ appGood?.goodPrice(good) }}</span>
            <span class='unit'>{{ PriceCoinName }}</span>
          </div>
          <div class='product-detail-text'>
            <div v-show='description'>
              <h3>{{ description ? $t(description?.Title) : '' }}</h3>
              <p v-html='description ? $t(description?.Message) : ""' />
            </div>
            <h3>{{ $t('MSG_WHY_TITLE') }}?</h3>
            <p v-html='$t("MSG_WHY_CONTENT")' />
            <div v-show='targetCoin?.Specs'>
              <h3>{{ $t('MSG_OFFICIAL_SPECS', { COIN_NAME: good?.CoinName }) }}</h3>
              <p>
                <img class='content-image' :src='targetCoin?.Specs'>
              </p>
            </div>
            <p>
              <a :href='targetCoin?.HomePage'>
                {{ $t('MSG_HOMEPAGE_WITH_RIGHT_ARROW', { COIN_NAME: good?.CoinName }) }}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class='product-sidebar'>
        <h3 class='form-title'>
          {{ $t('MSG_MINING_PURCHASE') }}
        </h3>
        <form action='javascript:void(0)' id='purchase'>
          <h4>{{ $t('MSG_PURCHASE_AMOUNT') }}</h4>
          <Input
            v-model:value='purchaseAmount'
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
        </form>
      </div>
    </PurchasePage>
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
  NotificationType,
  formatTime,
  useCoinStore,
  PriceCoinName,
  CoinDescriptionUsedFor,
  useCurrencyStore
} from 'npool-cli-v2'
import { throttle } from 'quasar'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ThrottleSeconds } from 'src/const/const'
import { AppGood, General, NotifyType, Order, useAdminAppGoodStore, useFrontendGeneralStore, useFrontendOrderStore, useLocalUserStore } from 'npool-cli-v4'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  goodId: string;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodId = computed(() => query.value.goodId)

const appGood = useAdminAppGoodStore()
const good = computed(() => appGood.getGoodByID(goodId.value) as AppGood)

const currency = useCurrencyStore()

const total = computed(() => Math.min(good.value?.PurchaseLimit, good.value?.Total))

const usedFor = ref(CoinDescriptionUsedFor.ProductDetail)
const coin = useCoinStore()
const description = computed(() => coin.getCoinDescriptionByCoinUsedFor(good.value?.CoinTypeID, usedFor.value))
const coins = computed(() => coin.Coins.filter((coin) => coin.ForPay && !coin.PreSale /* && coin.ENV === good.value?.Main?.ENV */))
const targetCoin = computed(() => coin.getCoinByID(good.value?.CoinTypeID))
const selectedCoinID = ref(undefined as unknown as string)
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
  }
})

const purchaseAmount = ref(1)
const purchaseAmountError = ref(false)
const onPurchaseAmountFocusIn = () => {
  purchaseAmountError.value = false
}
const onPurchaseAmountFocusOut = () => {
  purchaseAmountError.value = purchaseAmount.value <= 0 || purchaseAmount.value > total.value
}

const submitting = ref(false)

const router = useRouter()

const showBalanceDialog = ref(false)
const general = useFrontendGeneralStore()
const balance = computed(() => {
  return Number(general.getBalanceByID(paymentCoin.value?.ID as string))
})

const selectedCoinCurrency = ref(1)
const totalAmount = computed(() => Number(good.value.Price) * purchaseAmount.value / selectedCoinCurrency.value)
const inputBalance = ref(0)

const remainOrderAmount = computed(() => {
  const value = Math.ceil(totalAmount.value * 10000) / 10000 - inputBalance.value
  if (value < 0) {
    return 0
  }
  return value
})
const logined = useLocalUserStore()

const createOrder = () => {
  if (balance.value <= 0) {
    onSubmit()
  } else {
    inputBalance.value = 0
    showBalanceDialog.value = true
  }
}

const onMenuHide = () => {
  showBalanceDialog.value = false
}

const onPurchaseClick = throttle(() => {
  if (!logined.logined) {
    void router.push({
      path: '/signin',
      query: {
        target: '/product/aleo',
        goodId: goodId.value,
        purchaseAmount: purchaseAmount.value
      }
    })
    return
  }
  onPurchaseAmountFocusOut()
  if (purchaseAmountError.value) {
    return
  }
  getGenerals(0, 100)
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

const odr = useFrontendOrderStore()

const onSubmit = throttle(() => {
  showBalanceDialog.value = false
  submitting.value = true

  odr.createOrder({
    GoodID: goodId.value,
    Units: purchaseAmount.value,
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
}, ThrottleSeconds * 1000)

onMounted(() => {
  if (!good.value) {
    appGood.getAppGood({
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
  if (coins.value.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})
</script>

<style lang='sass' scoped>
.product-detail-text
  width: 100%

.submit-btn
  margin-top: 24px
</style>
