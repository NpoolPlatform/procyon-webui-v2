<template>
  <div :class='[ verifing ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container'>
          <div class='product-title-section'>
            <div class='product-page-icon'>
              <img :src='coins.getCoinLogo(coin)'>
            </div>
            <h1>{{ coin.Name }}</h1>
          </div>
          <div class='withdraw'>
            <h3>{{ $t('MSG_ASSET_WITHDRAWAL') }}</h3>
            <div class='info-flex'>
              <div class='full-section'>
                <h4>{{ $t('MSG_AVAILABLE_FOR_WITHDRAWAL') }}:</h4>
                <span class='number'>{{ earning - withdrawedEarning }}</span>
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
                  :max='earning - withdrawedEarning'
                  @focus='onAmountFocusIn'
                  @blur='onAmountFocusOut'
                />
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
            <input type='submit' value='Withdraw' class='submit' @click='onSubmit'>
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
  WithdrawType
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
const amount = ref(0)
const amountError = ref(false)
const onAmountFocusIn = () => {
  amountError.value = false
}
const onAmountFocusOut = () => {
  amountError.value = !amount.value || amount.value >= (earning.value - withdrawedEarning.value)
}

const withdrawType = ref(WithdrawType.Benefit)

interface Query {
  coinTypeId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coins = useCoinStore()
const coinTypeId = computed(() => query.value.coinTypeId)
const coin = computed(() => coins.getCoinByID(coinTypeId.value))

const transaction = useTransactionStore()

const accounts = useAccountStore()
const withdraws = computed(() => accounts.Accounts.filter((account) => account.Account.CoinTypeID === coinTypeId.value))
const selectedAccount = ref(undefined as unknown as WithdrawAccount)

const earning = ref(0)
const withdrawedEarning = ref(0)

const onSubmit = () => {
  if (!selectedAccount.value) {
    return
  }

  amountError.value = !amount.value || amount.value >= (earning.value - withdrawedEarning.value)
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
      WithdrawToAccountID: selectedAccount.value.Account.ID,
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

  totalEarningCoin(coinTypeId.value, (amount: number) => {
    earning.value = amount
    totalWithdrawedEarningCoin(coinTypeId.value, (amount: number) => {
      withdrawedEarning.value = amount
    })
  })
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
