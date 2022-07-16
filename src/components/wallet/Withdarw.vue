<template>
  <div :class='[ verifing || showReviewing || showWaiting ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container content-glass'>
          <div class='product-title-section'>
            <div class='product-page-icon'>
              <img :src='coins.getCoinLogo(coin)'>
            </div>
            <h1>{{ coin.Name }}</h1>
          </div>
          <div class='withdraw'>
            <h3>{{ $t('MSG_ASSET_WITHDRAWAL') }}</h3>
            <div class='info-flex'>
              <div class='three-section'>
                <h4>{{ $t('MSG_AVAILABLE_FOR_WITHDRAWAL') }}:</h4>
                <span class='number'>{{ balance }}</span>
                <span class='unit'>{{ coin.Unit }}</span>
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_TRANSACTION_FEE') }}:</h4>
                <span class='number'>{{ feeAmount }}</span>
                <span class='unit'>{{ coin.Unit }}</span>
              </div>
              <div class='full-section'>
                <h4>{{ $t('MSG_AMOUNT_TO_WITHDRAW') }} ({{ coin.Unit }}):</h4>
                <Input
                  v-model:value='amount'
                  type='number'
                  id='amount'
                  required
                  :error='amountError'
                  message='MSG_AMOUNT_TIP'
                  placeholder='MSG_AMOUNT_PLACEHOLDER'
                  :min='0'
                  :max='balance'
                  @focus='onAmountFocusIn'
                  @blur='onAmountFocusOut'
                />
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_AMOUNT_WILL_RECEIVE') }}:</h4>
                <span class='number'>{{ amount - feeAmount }}</span>
                <span class='unit'>{{ coin.Unit }}</span>
              </div>

              <div class='full-section'>
                <h4>{{ $t('MSG_SELECT_RECIPIENT_ADDRESS') }}:</h4>
                <span
                  v-for='withdraw in withdraws'
                  :key='withdraw.Address.ID'
                  :class='[ "address-option", selectedAccount?.Account?.ID === withdraw.Account.ID ? "address-selected" : "" ]'
                  @click='onAddressSelected(withdraw)'
                >
                  <span class='wallet-type'>{{ withdraw.Address.Labels.join(',') }}</span>
                  <span class='wallet-type coin-type'>{{ coin.Name }}</span>
                  <span class='number'>{{ withdraw.Account.Address }}</span>
                  <img class='checkmark' :src='checkmark'>
                </span>
              </div>
            </div>
            <input type='submit' :value='$t("MSG_WITHDRAW")' class='submit' @click='onSubmit'>
            <h3>{{ $t('MSG_GUIDE_AND_FAQ') }}</h3>
            <p v-html='$t("MSG_WITHDRAW_GUIDE_AND_FAQ_CONTENT")' />
          </div>
        </div>
      </div>
    </BackPage>
  </div>
  <q-dialog
    v-model='verifing'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='popup'>
      <CodeVerifier
        v-model:account='account'
        v-model:account-type='accountType'
        @verify='onCodeVerify'
        :used-for='MessageUsedFor.Withdraw'
      />
    </div>
  </q-dialog>
  <q-dialog
    v-model='showReviewing'
    seamless
    maximized
  >
    <div class='product-container content-glass popup-container'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_WITHDRAW_UNDER_REVIEW_TITLE') }}</h3>
            <p v-html='$t("MSG_WITHDRAW_UNDER_REVIEW_CONTENT_1")' />
            <p v-html='$t("MSG_WITHDRAW_UNDER_REVIEW_CONTENT_2")' />
            <button @click='onStateTipBtnClick'>
              {{ $t('MSG_I_UNDERSTAND') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog
    v-model='showWaiting'
    seamless
    maximized
  >
    <div class='product-container content-glass popup-container'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_WITHDRAW_WAITING_TITLE') }}</h3>
            <p v-html='$t("MSG_WITHDRAW_WAITING_CONTENT_1")' />
            <p v-html='$t("MSG_WITHDRAW_WAITING_CONTENT_2")' />
            <button @click='onStateTipBtnClick'>
              {{ $t('MSG_I_UNDERSTAND') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import {
  MessageUsedFor,
  AccountType,
  useCoinStore,
  totalWithdrawedEarningCoin,
  totalEarningCoin,
  useAccountStore,
  WithdrawAccount,
  NotificationType,
  useTransactionStore,
  WithdrawType,
  useBenefitStore,
  ReviewState,
  useBillingStore,
  totalPaymentBalanceUSD,
  useOrderStore,
  useCurrencyStore,
  Currency
} from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import checkmark from 'src/assets/icon-checkmark.svg'

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const verifing = ref(false)
const showReviewing = ref(false)
const showWaiting = ref(true)

const amount = ref(0)
const amountError = ref(false)
const onAmountFocusIn = () => {
  amountError.value = false
}
const onAmountFocusOut = () => {
  amountError.value = !amount.value || amount.value >= (earning.value - withdrawedEarning.value)
}

const withdrawType = ref(WithdrawType.Commission)

interface Query {
  coinTypeId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coins = useCoinStore()
const coinTypeId = computed(() => query.value.coinTypeId)
const coin = computed(() => coins.getCoinByID(coinTypeId.value))
const feeAmount = ref(0)

const transaction = useTransactionStore()

const accounts = useAccountStore()
const withdraws = computed(() => accounts.Accounts.filter((account) => {
  return account.Account?.CoinTypeID === coinTypeId.value && account.State === ReviewState.Approved
}))
const selectedAccount = ref(undefined as unknown as WithdrawAccount)

const earning = ref(0)
const _totalPaymentBalanceUSD = ref(0)
const withdrawedEarning = ref(0)
const balance = computed(() => Math.floor((earning.value + _totalPaymentBalanceUSD.value - withdrawedEarning.value) * 10000) / 10000)

const benefit = useBenefitStore()
const billing = useBillingStore()

const onSubmit = () => {
  if (!selectedAccount.value) {
    return
  }

  amountError.value = !amount.value || amount.value > (earning.value + _totalPaymentBalanceUSD.value - withdrawedEarning.value)
  if (amountError.value) {
    return
  }
  verifing.value = true
}

const onMenuHide = () => {
  verifing.value = false
}

const account = ref('')
const accountType = ref(AccountType.Email)

const router = useRouter()

const onCodeVerify = (code: string) => {
  transaction.submitWithdraw({
    Info: {
      CoinTypeID: coinTypeId.value,
      WithdrawToAccountID: selectedAccount.value.Account.ID as string,
      Amount: amount.value,
      WithdrawType: withdrawType.value
    },
    Account: account.value,
    AccountType: accountType.value,
    VerificationCode: code,
    Message: {
      Error: {
        Title: t('MSG_SUBMIT_WITHDRAW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    if (!error) {
      void router.back()
    }
  })
  verifing.value = false
}

const onStateTipBtnClick = () => {
  showWaiting.value = false
  showReviewing.value = false
}

const getPaymentBalances = () => {
  billing.getPaymentBalances({
    Message: {
      Error: {
        Title: t('MSG_GET_PAYMENT_BALANCES'),
        Message: t('MSG_GET_PAYMENT_BALANCES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    totalPaymentBalanceUSD((usdAmount: number) => {
      _totalPaymentBalanceUSD.value = usdAmount
    })
  })
}

const order = useOrderStore()

const getOrders = () => {
  order.getOrders({
    Message: {
      Error: {
        Title: t('MSG_GET_ORDERS'),
        Message: t('MSG_GET_ORDERS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    getPaymentBalances()
  })
}

const currency = useCurrencyStore()

const getCurrencies = () => {
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
    getOrders()
  })
}

const getCoins = () => {
  coins.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    getCurrencies()
  })
}

onMounted(() => {
  accounts.getWithdrawAccounts({
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })

  coins.getCurrentFee({
    CoinTypeID: coinTypeId.value,
    Message: {
      Error: {
        Title: t('MSG_GET_CURRENT_FEE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (amount: number) => {
    feeAmount.value = Math.ceil(amount * 1000000) / 1000000
  })

  totalEarningCoin(coinTypeId.value, (amount: number) => {
    earning.value = amount
    totalWithdrawedEarningCoin(coinTypeId.value, (amount: number) => {
      withdrawedEarning.value = amount
    })
    benefit.getCommissionCoinSettings({
      Message: {
        Error: {
          Title: t('MSG_GET_COMMISSION_COIN_SETTINGS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      const index = benefit.CommissionCoinSettings.findIndex((el) => el.Using)
      if (index < 0) {
        return
      }
      if (coinTypeId.value === benefit.CommissionCoinSettings[index].CoinTypeID) {
        benefit.getCommission({
          Message: {
            Error: {
              Title: t('MSG_GET_COMMISSION_FAIL'),
              Popup: true,
              Type: NotificationType.Error
            }
          }
        }, () => {
          earning.value += benefit.Commission.Balance
          billing.getPaymentBalances({
            Message: {}
          }, () => {
            totalPaymentBalanceUSD((usdAmount: number) => {
              _totalPaymentBalanceUSD.value = usdAmount
            })
          })
        })
      }
    })
  })

  getCoins()
})

const onAddressSelected = (account: WithdrawAccount) => {
  selectedAccount.value = account
}

</script>

<style lang='sass' scoped>
.wallet-type
  margin-right: 10px

.coin-type
  text-transform: uppercase !important
</style>
