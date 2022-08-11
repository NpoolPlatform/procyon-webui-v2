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
                  :min='feeAmount'
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
  useCoinStore,
  useAccountStore,
  WithdrawAccount,
  NotificationType,
  ReviewState,
  useCurrencyStore,
  Currency,
  AccountType
} from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import checkmark from 'src/assets/icon-checkmark.svg'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { useLocalTransactionStore, AccountType as LocalAccountType } from 'src/teststore/mock/transaction'
import { useLocalLedgerStore } from 'src/localstore/ledger'

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
  amountError.value = !amount.value || amount.value > balance.value || amount.value <= feeAmount.value
}

interface Query {
  coinTypeId: string;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coins = useCoinStore()
const coinTypeId = computed(() => query.value.coinTypeId)
const coin = computed(() => coins.getCoinByID(coinTypeId.value))
const feeAmount = ref(0)

const accounts = useAccountStore()
const withdraws = computed(() => accounts.Accounts.filter((account) => {
  return account.Account?.CoinTypeID === coinTypeId.value && account.State === ReviewState.Approved
}))
const selectedAccount = ref(undefined as unknown as WithdrawAccount)

const general = useGeneralStore()
const localledger = useLocalLedgerStore()
const ltransation = useLocalTransactionStore()

const balance = computed(() => general.getCoinBalance(coin.value.ID as string))

const onSubmit = () => {
  if (!selectedAccount.value) {
    return
  }

  amountError.value = !amount.value || amount.value > balance.value || amount.value <= feeAmount.value
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

const getUserGenerals = (offset:number, limit: number) => {
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
  }, () => {
    if (general.Generals.Total <= general.Generals.Generals.length) {
      localledger.initGeneral(general.Generals.Generals)
      return
    }
    getUserGenerals(limit + offset, limit)
  })
}

const onCodeVerify = (code: string) => {
  let accType = LocalAccountType.EMAIL

  switch (accountType.value) {
    case AccountType.Email:
      accType = LocalAccountType.EMAIL
      break
    case AccountType.Mobile:
      accType = LocalAccountType.MOBILE
      break
    case AccountType.Google:
      accType = LocalAccountType.GOOGLE
      break
  }

  ltransation.createWithdraw({
    CoinTypeID: coinTypeId.value,
    Amount: `${amount.value}`,
    AccountID: selectedAccount.value.Account.ID as string,
    VerificationCode: code,
    Account: account.value,
    AccountType: accType,
    Message: {
      Error: {
        Title: t('MSG_SUBMIT_WITHDRAW_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    // TODO
    if (!error) {
      getUserGenerals(0, 100)
      void router.push({ path: '/wallet' })
    }
  })
  verifing.value = false
}

const onStateTipBtnClick = () => {
  showWaiting.value = false
  showReviewing.value = false
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
    // TODO
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

  getCoins()

  if (localledger.Generals.length === 0) {
    getUserGenerals(0, 100)
  }

  if (accounts.Accounts.filter((el) => {
    return el.Account.CoinTypeID === coinTypeId.value && el.State === ReviewState.Approved
  }).length === 0) {
    accounts.getWithdrawAccounts({
      Message: {}
    })
  }
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
