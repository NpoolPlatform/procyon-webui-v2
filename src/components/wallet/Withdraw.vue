<template>
  <div :class='[ verifying || showReviewing || showWaiting ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container content-glass'>
          <div class='product-title-section'>
            <div class='product-page-icon one-one-line'>
              <img :src='target?.Logo'>
            </div>
            <h1>{{ target ? coinLabel(target) : '' }}</h1>
          </div>
          <div class='withdraw'>
            <h3>{{ $t('MSG_ASSET_WITHDRAWAL') }}</h3>
            <div class='info-flex'>
              <div class='three-section'>
                <h4>{{ $t('MSG_AVAILABLE_FOR_WITHDRAWAL') }}:</h4>
                <span class='number'>{{ util.getLocaleString(balance) }}</span>
                <span class='unit'>{{ target?.Unit }}</span>
              </div>
              <div v-if='withdrawType === "ExternalAddress"' class='three-section'>
                <h4>{{ $t('MSG_TRANSACTION_FEE') }}:</h4>
                <span class='number'>{{ util.getLocaleString(feeAmount) }}</span>
                <span class='unit'>{{ target?.Unit }}</span>
              </div>
              <div class='full-section'>
                <h4>{{ $t('MSG_AMOUNT_TO_WITHDRAW') }} ({{ target?.Unit }}):</h4>
                <Input
                  v-model:value='amount'
                  type='number'
                  id='amount'
                  required
                  :error='amountError'
                  :message='message'
                  placeholder='MSG_AMOUNT_PLACEHOLDER'
                  :min='feeAmount'
                  :max='balance'
                  @focus='onAmountFocusIn'
                  @blur='onAmountFocusOut'
                />
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_AMOUNT_WILL_RECEIVE') }}:</h4>
                <span v-if='withdrawType === "ExternalAddress"' class='number'>{{ util.getLocaleString(receiveAmount) }}</span>
                <span v-else class='number'>{{ amount > 0 ? util.getLocaleString(amount.toFixed(4)) : 0 }}</span>
                <span class='unit'>{{ target?.Unit }}</span>
              </div>

              <div class='full-section'>
                <h4>{{ $t('MSG_WITHDRAW_TYPE') }}:</h4>
                <select :name='$t("MSG_WITHDRAW_TYPE")' v-model='withdrawType'>
                  <option value='ExternalAddress' :selected='withdrawType === "ExternalAddress"'>
                    {{ $t('MSG_EXTERNAL_ADDRESS') }}
                  </option>
                  <option value='InternalTransfer' :selected='withdrawType === "InternalTransfer"'>
                    {{ $t('MSG_INTERNAL_TRANSFER') }}
                  </option>
                </select>
              </div>

              <div class='full-section'>
                <h4>{{ $t('MSG_SELECT_RECIPIENT_ADDRESS') }}:</h4>
                <div v-if='withdrawType === "ExternalAddress"'>
                  <div
                    v-for='_withdraw in withdraws'
                    :key='_withdraw.ID'
                    :class='[ "address-option", selectedAccount?.ID === _withdraw.ID ? "address-selected" : "" , "address-line"]'
                    @click='onAddressSelected(_withdraw)'
                  >
                    <span :class='[_withdraw.Labels?.join(",")?.length > 0? "wallet-type": ""]'>{{ _withdraw.Labels?.join(',') }}</span>
                    <span class='wallet-type coin-type'>{{ target?.Name }}</span>
                    <span class='number'>{{ _withdraw?.Address }}<img class='checkmark address-checkmark' :src='checkmark'></span>
                  </div>
                </div>
                <div v-else>
                  <div
                    v-for='_account in transferAccounts'
                    :key='_account.TargetUserID'
                    :class='[ "address-option", selectedTransferAccount?.TargetUserID === _account.TargetUserID ? "address-selected" : "" , "address-line"]'
                    @click='onTransferAccountSelected(_account)'
                  >
                    <span :class='[baseUser.displayName1(_account.TargetEmailAddress, _account.TargetPhoneNO, _account.TargetFirstName, _account.TargetLastName, locale as string)?.length > 0 ? "wallet-type": ""]'>{{ baseUser.displayName1(_account.TargetEmailAddress, _account.TargetPhoneNO, _account.TargetFirstName, _account.TargetLastName, locale as string) }}</span>
                    <span class='wallet-type coin-type'>{{ $t('MSG_INTERNAL') }}</span>
                    <span class='number'>{{ _account.TargetEmailAddress.length ? _account.TargetEmailAddress : _account.TargetPhoneNO }}<img class='checkmark address-checkmark' :src='checkmark'></span>
                  </div>
                </div>
              </div>
            </div>
            <div class='submit'>
              <WaitingBtn
                label='MSG_WITHDRAW'
                type='button'
                :disabled='(submitting || disableTtn)'
                :waiting='submitting'
                @click='onSubmit'
              />
            </div>
            <h3>{{ $t('MSG_GUIDE_AND_FAQ') }}</h3>
            <p v-html='$t("MSG_WITHDRAW_GUIDE_AND_FAQ_CONTENT")' />
          </div>
        </div>
      </div>
    </BackPage>
  </div>
  <q-dialog
    v-model='verifying'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='popup'>
      <CodeVerifier
        v-model:account='account'
        v-model:account-type='accountType'
        @verify='onCodeVerify'
        :used-for='withdrawType === "ExternalAddress" ? UsedFor.Withdraw : UsedFor.Transfer'
        @cancel='onCancelClick'
        show-cancel
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
          <div class='confirmation content'>
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
import { ref, defineAsyncComponent, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  TransferAccount,
  useFrontendTransferAccountStore,
  NotifyType,
  useBaseUserStore,
  useFrontendTransferStore,
  Transfer,
  UsedFor,
  AccountType,
  useFrontendUserAccountStore,
  AccountUsedFor,
  Account,
  useAdminAppCoinStore,
  useFrontendGeneralStore,
  useFrontendWithdrawStore,
  General,
  useFrontendDetailStore,
  useAdminCurrencyStore,
  AppCoin,
  useLocaleStringStore
} from 'npool-cli-v4'
import checkmark from 'src/assets/icon-checkmark.svg'
import { getCoins, getCurrencies } from 'src/api/chain'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

interface Query {
  coinTypeID: string;
  type: string;
}

const query = computed(() => route.query as unknown as Query)
const type = computed(() => query.value.type)

const util = useLocaleStringStore()

const coin = useAdminAppCoinStore()
const coinTypeID = computed(() => query.value.coinTypeID)
const target = computed(() => coin.getCoinByID(coinTypeID.value))

const coinLabel = (asset: AppCoin) => {
  let label = asset.Name
  if (asset.DisplayNames?.length > 2 && asset.DisplayNames?.[2]?.length > 0) {
    label = asset.DisplayNames?.[2]
  }
  return label
}

const withdrawType = ref('ExternalAddress')
watch(withdrawType, () => {
  selectedAccountIndex.value = 0
})

const transferAccount = useFrontendTransferAccountStore()
const transferAccounts = computed(() => transferAccount.TransferAccounts.TransferAccounts)
const selectedTransferAccount = computed(() => transferAccounts.value.length > 0 ? transferAccounts.value[selectedAccountIndex.value] : undefined as unknown as TransferAccount)

const userAccount = useFrontendUserAccountStore()
const withdraws = computed(() => userAccount.withdrawAddress.filter((el) => el.CoinTypeID === coinTypeID.value).filter((el) => !el.Blocked && el.Active))
const selectedAccountIndex = ref(0)
const selectedAccount = computed(() => withdraws.value.length > 0 ? withdraws.value[selectedAccountIndex.value] : undefined as unknown as Account)

const verifying = ref(false)
const showReviewing = ref(false)
const showWaiting = ref(true)

const message = computed(() => {
  if (withdrawType.value === 'ExternalAddress') {
    if (amount.value > Number(target.value?.MaxAmountPerWithdraw)) {
      return t('MSG_WITHDRAW_LIMIT_TIP', { LIMIT: parseFloat(target?.value?.MaxAmountPerWithdraw as string) })
    }
  }
  return t('MSG_WITHDRAW_AMOUNT_TIP', { LOW: feeAmount.value, HIGH: balance.value })
})

const amount = ref(0)
const amountError = ref(false)
const onAmountFocusIn = () => {
  amountError.value = false
}
const onAmountFocusOut = () => {
  amountError.value = !amount.value || amount.value > balance.value ||
                      (withdrawType.value === 'ExternalAddress' ? amount.value <= feeAmount.value : amount.value === 0) ||
                      (withdrawType.value === 'ExternalAddress' ? amount.value > parseFloat(target.value?.MaxAmountPerWithdraw as string) : amount.value === 0)
}

const route = useRoute()

const balance = computed(() => Number(general.getBalanceByID(coinTypeID.value)))
const feeAmount = computed(() => {
  if (withdrawType.value === 'InternalTransfer') {
    return 0
  }
  if (target?.value?.WithdrawFeeByStableUSD) {
    if (target?.value?.WithdrawFeeAmount.length > 0) {
      return Number(target.value?.WithdrawFeeAmount) / currency.getUSDCurrency(coinTypeID.value)
    }
  }
  return Math.ceil(Number(target.value?.WithdrawFeeAmount) * 1000000) / 1000000
})
const receiveAmount = computed(() => {
  return amount.value - feeAmount.value > 0 ? (amount.value - feeAmount.value).toFixed(4) : 0
})

const disableTtn = computed(() => (withdrawType.value === 'ExternalAddress' && withdraws.value.length === 0) || (withdrawType.value === 'InternalTransfer' && transferAccounts.value.length === 0))

const general = useFrontendGeneralStore()
const detail = useFrontendDetailStore()
const withdraw = useFrontendWithdrawStore()
const transfer = useFrontendTransferStore()
const baseUser = useBaseUserStore()

const account = ref('')
const accountType = ref(AccountType.Email)

const submitting = ref(false)
const onMenuHide = () => {
  verifying.value = false
}
const onCancelClick = () => {
  onMenuHide()
}

const onSubmit = () => {
  amountError.value = !amount.value || amount.value > balance.value ||
                      (withdrawType.value === 'ExternalAddress' ? amount.value <= feeAmount.value : amount.value === 0) ||
                      (withdrawType.value === 'ExternalAddress' ? amount.value > parseFloat(target.value?.MaxAmountPerWithdraw as string) : amount.value === 0)
  if (amountError.value) {
    return
  }
  if (!selectedAccount.value && !selectedTransferAccount.value) {
    return
  }
  verifying.value = true
}

const router = useRouter()

const onCodeVerify = (code: string) => {
  submitting.value = true

  if (withdrawType.value === 'ExternalAddress') {
    withdraw.createWithdraw({
      CoinTypeID: coinTypeID.value,
      Amount: `${amount.value}`,
      AccountID: selectedAccount.value.AccountID,
      VerificationCode: code,
      Account: account.value,
      AccountType: accountType.value,
      Message: {
        Error: {
          Title: t('MSG_SUBMIT_WITHDRAW_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, (error: boolean) => {
      submitting.value = false
      if (error) {
        return
      }
      getLatestData()
      void router.push({ path: '/wallet' })
    })
  } else {
    transfer.createTransfer({
      Account: account.value,
      AccountType: accountType.value,
      VerificationCode: code,
      TargetUserID: selectedTransferAccount.value?.TargetUserID,
      Amount: `${amount.value}`,
      CoinTypeID: coinTypeID.value,
      Message: {
        Error: {
          Title: t('MSG_SUBMIT_WITHDRAW_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, (tarns: Transfer, error: boolean) => {
      submitting.value = false
      if (error) {
        return
      }

      getLatestData()
      void router.push({ path: '/wallet' })
    })
  }
  verifying.value = false
}

const getLatestData = () => {
  detail.$reset()
  general.$reset()
}

const onStateTipBtnClick = () => {
  showWaiting.value = false
  showReviewing.value = false
}

const onAddressSelected = (row: Account) => {
  selectedAccountIndex.value = withdraws.value.findIndex((el) => el.ID === row.ID)
}

const onTransferAccountSelected = (account: TransferAccount) => {
  selectedAccountIndex.value = transferAccounts.value.findIndex((el) => el.ID === account.ID)
}

const currency = useAdminCurrencyStore()

onMounted(() => {
  if (general.Generals.Generals.length === 0) {
    getGenerals(0, 20)
  }

  userAccount.$reset()
  if (userAccount.UserAccounts.UserAccounts.length === 0) {
    getUserAccounts(0, 20)
  }

  if (transferAccount.TransferAccounts.TransferAccounts.length === 0) {
    getTransferAccounts(0, 20)
  }
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }
  if (type.value) {
    withdrawType.value = type.value
  }
  if (currency.Currencies.Currencies.length === 0) {
    getCurrencies(0, 100)
  }
})

const getUserAccounts = (offset: number, limit: number) => {
  userAccount.getUserAccounts({
    Offset: offset,
    Limit: limit,
    UsedFor: AccountUsedFor.UserWithdraw,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_ACCOUNTS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (accounts: Array<Account>, error: boolean) => {
    if (error || accounts.length < limit) return
    getUserAccounts(offset + limit, limit)
  })
}

const getTransferAccounts = (offset: number, limit: number) => {
  transferAccount.getTransfers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (transfers: Array<TransferAccount>, error: boolean) => {
    if (error || transfers.length < limit) {
      return
    }
    getTransferAccounts(limit + offset, limit)
  })
}

const getGenerals = (offset: number, limit: number) => {
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
  }, (error: boolean, rows: Array<General>) => {
    if (error || rows.length < limit) {
      return
    }
    getGenerals(limit + offset, limit)
  })
}
</script>

<style lang='sass' scoped>
.wallet-type
  margin-right: 10px
.address-line
  line-height: 1.7
  margin-top: 10px
.coin-type
  text-transform: uppercase !important
.address-checkmark
  margin-left: 10px
.one-one-line
  display: inline-block
  margin-right: 15px
</style>
