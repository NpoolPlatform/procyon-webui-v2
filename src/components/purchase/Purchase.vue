<template>
  <div :class='[ showBalanceDialog ? "blur" : "" ]'>
    <PurchasePage :good='(appPowerRental as apppowerrental.AppPowerRental)'>
      <div class='info'>
        <h3 class='form-title'>
          {{ $t('MSG_PRODUCT_DETAILS') }}
        </h3>
        <div class='info-flex'>
          <div class='three-section'>
            <h4>{{ $t('MSG_DAILY_MINING_REWARDS') }}:</h4>
            <span class='number'>*</span>
            <span class='unit'>{{ appPowerRental?.CoinUnit }} / {{ $t('MSG_DAY') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_SERVICE_PERIOD') }}:</h4>
            <span class='number'>{{ sdk.appPowerRental.minOrderDurationDays(appPowerRental?.AppGoodID as string) }}</span>
            <span class='unit'>{{ $t('MSG_DAYS') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_TECHNIQUE_SERVICE_FEE') }}:</h4>
            <span class='number'>{{ techServiceFeePercent }}</span>
            <span class='unit'>%</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_MAINTENANCE_FEE') }}:</h4>
            <span class='number'>1.5</span>
            <span class='unit'>{{ constant.PriceCoinName }} / {{ $t('MSG_DAY') }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_ORDER_EFFECTIVE') }}:</h4>
            <span class='number'>{{ utils.formatTime(appPowerRental?.ServiceStartAt as number) }}</span>
          </div>
          <div class='three-section'>
            <h4>{{ $t('MSG_PRICE') }}:</h4>
            <span class='number'>{{ appPowerRental?.UnitPrice }}</span>
            <span class='unit'>{{ constant.PriceCoinName }}</span>
          </div>
          <div class='product-detail-text'>
            <div v-show='description'>
              <h3>{{ description ? $t(description?.Title) : '' }}</h3>
              <p v-html='description ? $t(description?.Message) : ""' />
            </div>
            <h3>{{ $t('MSG_WHY_TITLE') }}?</h3>
            <p v-html='$t("MSG_WHY_CONTENT")' />
            <div v-show='targetCoin?.Specs'>
              <h3>{{ $t('MSG_OFFICIAL_SPECS', { COIN_NAME: appPowerRental?.CoinName }) }}</h3>
              <p>
                <img class='content-image' :src='targetCoin?.Specs'>
              </p>
            </div>
            <p>
              <a :href='targetCoin?.HomePage'>
                {{ $t('MSG_HOMEPAGE_WITH_RIGHT_ARROW', { COIN_NAME: appPowerRental?.CoinName }) }}
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
                {{ myCoin?.Unit }} ({{ myCoin?.Name?.toLowerCase().includes('bitcoin') ? $t('MSG_BTC_INFO') : utils.formatCoinName(myCoin?.Name as string) }})
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
import { throttle } from 'quasar'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ThrottleSeconds } from 'src/const/const'
import { ledger, notify, order, user, appcoindescription, constant, coin, utils, apppowerrental, powerrentalorder, sdk } from 'src/npoolstore'
import { PaymentBalance } from 'src/npoolstore/order/payment'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
// const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  appGoodID: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const appGoodID = computed(() => query.value.appGoodID)

const appPowerRental = computed(() => sdk.appPowerRental.appPowerRental(appGoodID.value))

const total = computed(() => sdk.appPowerRental.purchaseLimit(appGoodID.value))

const usedFor = ref(appcoindescription.CoinDescriptionUsedFor.ProductPage)
const coindescription = appcoindescription.useCoinDescriptionStore()
const _coin = coin.useCoinStore()
const targetCoin = computed(() => _coin.coinByEntID(appPowerRental.value?.CoinTypeID as string))

const description = computed(() => coindescription.coinUsedForDescription(undefined, appPowerRental.value?.CoinTypeID as string, usedFor.value))
const coins = computed(() => _coin.coins().filter((coin) => coin.ForPay && !coin.Presale && coin.ENV === targetCoin.value?.ENV))
const techServiceFeePercent = computed(() => sdk.appPowerRental.techniqueFeeRatio(appGoodID.value))

const selectedCoinID = ref(undefined as unknown as string)
const paymentCoin = computed({
  get: () => {
    const myCoin = _coin.coinByEntID(selectedCoinID.value)
    if (!myCoin) {
      for (const scoin of coins.value) {
        if (scoin.Name?.toLowerCase().includes(constant.PriceCoinName.toLowerCase())) {
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
    selectedCoinID.value = val?.EntID as string
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
const logined = user.useLocalUserStore()
const general = ledger.useLedgerStore()
const balance = computed(() => {
  return Number(general.coinBalance(undefined, logined.loginedUserID as string, paymentCoin.value?.EntID as string))
})

const selectedCoinCurrency = ref(1)
const totalAmount = computed(() => Number(appPowerRental.value?.UnitPrice) * purchaseAmount.value / selectedCoinCurrency.value)
const inputBalance = ref(0)

const remainOrderAmount = computed(() => {
  const value = Math.ceil(totalAmount.value * 10000) / 10000 - inputBalance.value
  if (value < 0) {
    return 0
  }
  return value
})

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
        appGoodID: appGoodID.value,
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
  }, (error: boolean, g?: Array<ledger.Ledger>) => {
    submitting.value = false
    if (error) {
      return
    }
    if (!g?.length) {
      createOrder()
      return
    }
    getGenerals(limit + offset, limit)
  })
}

const getRequiredAppGoods = computed(() => sdk.requiredAppGood.requiredAppGoods.value?.filter((el) => el.MainAppGoodID === appGoodID.value).map((al) => al.RequiredAppGoodID))

const onSubmit = throttle(() => {
  showBalanceDialog.value = false
  submitting.value = true

  sdk.powerRentalOrder.createPowerRentalOrder({
    AppGoodID: appGoodID.value,
    Units: purchaseAmount.value.toString(),
    DurationSeconds: appPowerRental.value?.MinOrderDurationSeconds,
    FeeAppGoodIDs: getRequiredAppGoods.value,
    FeeDurationSeconds: appPowerRental.value?.MinOrderDurationSeconds,
    Balances: [{ CoinTypeID: paymentCoin.value?.EntID as string, Amount: `${inputBalance.value}` } as PaymentBalance],
    InvestmentType: order.InvestmentType.FullPayment,
    CouponIDs: [],
    AppGoodStockID: appPowerRental.value?.AppGoodStockID as string
  }, (error: boolean, o?: powerrentalorder.PowerRentalOrder) => {
    submitting.value = false
    if (error) {
      return
    }

    void router.push({
      path: '/extrapayment',
      query: {
        orderId: o?.ID
      }
    })
  })
}, ThrottleSeconds * 1000)

const requiredAppGoods = computed(() => sdk.requiredAppGood.requiredAppGoods.value)
onMounted(() => {
  if (!appPowerRental.value) {
    sdk.appPowerRental.getAppPowerRental(appGoodID.value, () => {
      // TODO
    })
  }
  if (!requiredAppGoods.value?.length) {
    sdk.requiredAppGood.getRequiredAppGoods(0, 0)
  }

  if (coins.value.length === 0) {
    _coin.getCoins({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: 'MSG_GET_COINS',
          Message: 'MSG_GET_COINS_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (!description.value) {
    coindescription.getCoinDescriptions({
      Offset: 0,
      Limit: 100,
      Message: {
        Error: {
          Title: 'MSG_GET_COIN_DESCRIPTIONS',
          Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
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
