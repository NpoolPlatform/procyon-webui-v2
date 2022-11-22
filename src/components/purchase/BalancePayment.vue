<template>
  <BackPage>
    <div class='content'>
      <div class='form-container content-glass'>
        <h3>{{ $t('MSG_MINING_PURCHASE') }}</h3>
        <div class='info-flex'>
          <form>
            <label>{{ $t('MSG_SELECT_PAYMENT_CURRENCY') }} {{ currency }}</label>
            <CoinSelector
              v-model:selected-coin='selectedCoin'
              label=''
              :hide-label='true'
              :disabled='true'
            />
            <label>{{ $t('MSG_AVAILABLE_BALANCE') }}</label>
            <div class='three-section'>
              <span class='number'>{{ balance.toFixed(4) }}</span>
              <span class='unit'>USDT</span>
            </div>
            <label>{{ $t('MSG_ALEO_PURCHASE_AMOUNT') }}</label>
            <input type='number' v-model='purchaseAmount' disabled>
            <label>{{ $t('MSG_ORDER_DUE_AMOUNT') }}</label>
            <div class='three-section'>
              <span class='number'>{{ paymentAmount }}</span>
              <span class='unit'>USDT</span>
            </div>
            <div class='warning warning-pink' v-if='insufficientFunds'>
              <img src='font-awesome/warning.svg'>
              <span>Insufficient funds! <a href='javascript:void(0)'>Please transfer additional funds to your Wallet</a>.</span>
            </div>
            <div class='submit-container'>
              <WaitingBtn
                label='MSG_PURCHASE'
                type='submit'
                :class='[insufficientFunds ? "submit-gray" : "", "submit"]'
                :disabled='submitting || insufficientFunds'
                :waiting='submitting'
                @click='onPurchaseClick'
              />
            </div>
            <input type='submit' value='Go to Wallet' class='submit submit-alt' @click='goWallet'>
          </form>
        </div>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { Coin, useAdminOracleStore, useCoinStore } from 'npool-cli-v2'
import {
  useFrontendOrderStore,
  NotifyType,
  Order,
  useFrontendGeneralStore,
  General,
  useAdminAppGoodStore
} from 'npool-cli-v4'
import { DefaultGoodID } from 'src/const/const'
import { defineAsyncComponent, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

interface Query {
  goodID: string;
  purchaseAmount: number;
  coinTypeID: string;
}

const router = useRouter()
const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodID = computed(() => query.value.goodID?.length ? query.value.goodID : DefaultGoodID)
const purchaseAmount = computed(() => query.value.purchaseAmount)
const coinTypeID = ref(query.value.coinTypeID)

const coin = useCoinStore()
const selectedCoin = computed({
  get: () => coin.getCoinByID(coinTypeID.value),
  set: (val: Coin) => {
    coinTypeID.value = val.ID as string
  }
})

const good = useAdminAppGoodStore()
const targetGood = computed(() => good.getGoodByID(goodID.value))
const goodPrice = computed(() => good.getPriceByID(goodID.value))
const paymentAmount = computed(() => Number(goodPrice.value) * purchaseAmount.value)

const general = useFrontendGeneralStore()
const balance = computed(() => Number(general.getBalanceByID(coinTypeID.value)) * currency.value)

const oracle = useAdminOracleStore()
const currency = computed(() => oracle.getCurrencyByID(coinTypeID.value))

const insufficientFunds = computed(() => balance.value < paymentAmount.value)

const order = useFrontendOrderStore()
const submitting = ref(false)

const onPurchaseClick = () => {
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
})

</script>
