<template>
  <div :class='[ verifing || showReviewing || showWaiting ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container content-glass'>
          <div class='product-title-section'>
            <div class='product-page-icon'>
              <img :src='coins.getCoinLogo(coin)'>
            </div>
            <h1>{{ coinName(coin?.ID as string) }}</h1>
          </div>
          <div class='withdraw'>
            <h3>{{ $t('MSG_ASSET_WITHDRAWAL') }}</h3>
            <div class='info-flex'>
              <div class='three-section'>
                <h4>{{ $t('MSG_AVAILABLE_FOR_WITHDRAWAL') }}:</h4>
                <span class='number'>{{ balance }}</span>
                <span class='unit'>{{ coin?.Unit }}</span>
              </div>
              <div v-if='withdrawType === "ExternalAddress"' class='three-section'>
                <h4>{{ $t('MSG_TRANSACTION_FEE') }}:</h4>
                <span class='number'>{{ feeAmount }}</span>
                <span class='unit'>{{ coin?.Unit }}</span>
              </div>
              <div class='full-section'>
                <h4>{{ $t('MSG_AMOUNT_TO_WITHDRAW') }} ({{ coin?.Unit }}):</h4>
                <Input
                  v-model:value='amount'
                  type='number'
                  id='amount'
                  required
                  :error='amountError'
                  :message='$t("MSG_WITHDRAW_AMOUNT_TIP", {MAX: balance})'
                  placeholder='MSG_AMOUNT_PLACEHOLDER'
                  :min='withdrawType === "ExternalAddress" ? feeAmount : 0'
                  :max='balance'
                  @focus='onAmountFocusIn'
                  @blur='onAmountFocusOut'
                />
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_AMOUNT_WILL_RECEIVE') }}:</h4>
                <span v-if='withdrawType === "ExternalAddress"' class='number'>{{ amount - feeAmount > 0 ? (amount - feeAmount).toFixed(4) : 0 }}</span>
                <span v-else class='number'>{{ amount > 0 ? amount.toFixed(4) : 0 }}</span>
                <span class='unit'>{{ coin?.Unit }}</span>
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
                    v-for='withdraw in withdraws'
                    :key='withdraw.Address.ID'
                  >
                    <span
                      :class='[ "address-option", selectedAccount?.Account?.ID === withdraw.Account.ID ? "address-selected" : "" ]'
                      @click='onAddressSelected(withdraw)'
                    >
                      <span class='wallet-type'>{{ withdraw.Address.Labels.join(',') }}</span>
                      <span class='wallet-type coin-type'>{{ coinName(coin?.ID as string) }}</span>
                      <span class='number'>{{ withdraw.Account.Address }}</span>
                      <img class='checkmark' :src='checkmark'>
                    </span>
                  </div>
                </div>
                <div v-else>
                  <div
                    v-for='_account in transferAccounts'
                    :key='_account.TargetUserID'
                  >
                    <span
                      :class='[ "address-option", selectedTransferAccount?.TargetUserID === _account.TargetUserID ? "address-selected" : "" ]'
                      @click='onTransferAccountSelected(_account)'
                    >
                      <span class='wallet-type'>{{ baseuser.displayName1(_account.TargetEmailAddress, _account.TargetPhoneNO, _account.TargetFirstName, _account.TargetLastName, locale as string) }}</span>
                      <span class='wallet-type coin-type'>{{ $t('MSG_INTERNAL') }}</span>
                      <span class='number'>{{ _account.TargetEmailAddress.length ? _account.TargetEmailAddress : _account.TargetPhoneNO }}</span>
                      <img class='checkmark' :src='checkmark'>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class='submit'>
              <WaitingBtn
                label='MSG_WITHDRAW'
                type='button'
                :disabled='submitting'
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
        :used-for='withdrawType === "ExternalAddress" ? MessageUsedFor.Withdraw : MessageUsedFor.UsedForTransfer'
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
  AccountType,
  SecondsEachDay
} from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { useLocalTransactionStore } from 'src/teststore/mock/transaction'
import { useLocalLedgerStore } from 'src/localstore/ledger'
import { IntervalKey } from 'src/const/const'
import { useLocalCoinStore } from 'src/localstore/coin'
import {
  TransferAccount,
  useFrontendTransferAccountStore,
  NotifyType,
  useBaseUserStore,
  useFrontendTransferStore,
  Transfer
} from 'npool-cli-v4'

import checkmark from 'src/assets/icon-checkmark.svg'

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const withdrawType = ref('ExternalAddress')
watch(withdrawType, () => {
  selectedAccountIndex.value = 0
})

const verifing = ref(false)
const showReviewing = ref(false)
const showWaiting = ref(true)

const amount = ref(0)
const amountError = ref(false)
const onAmountFocusIn = () => {
  amountError.value = false
}
const onAmountFocusOut = () => {
  amountError.value = !amount.value || amount.value > balance.value || (withdrawType.value === 'ExternalAddress' ? amount.value <= feeAmount.value : amount.value === 0)
}

interface Query {
  coinTypeId: string;
}

const localcoin = useLocalCoinStore()
const coinName = computed(() => (ID: string) => localcoin.formatCoinName(ID))

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coins = useCoinStore()
const coinTypeId = computed(() => query.value.coinTypeId)
const coin = computed(() => coins.getCoinByID(coinTypeId.value))
const feeAmount = ref(0)
const submitting = ref(false)

const accounts = useAccountStore()
const withdraws = computed(() => accounts.Accounts.filter((account) => {
  return account.Account?.CoinTypeID === coinTypeId.value && account.State === ReviewState.Approved
}))

const selectedAccountIndex = ref(0)
const selectedAccount = computed(() => withdraws.value.length > 0 ? withdraws.value[selectedAccountIndex.value] : undefined as unknown as WithdrawAccount)

const general = useGeneralStore()
const localledger = useLocalLedgerStore()
const ltransation = useLocalTransactionStore()
const transferAccount = useFrontendTransferAccountStore()
const transfer = useFrontendTransferStore()
const baseuser = useBaseUserStore()

const transferAccounts = computed(() => transferAccount.TransferAccounts.TransferAccounts)
const selectedTransferAccount = computed(() => transferAccounts.value.length > 0 ? transferAccounts.value[selectedAccountIndex.value] : undefined as unknown as TransferAccount)

const balance = computed(() => general.getCoinBalance(coin?.value?.ID as string))

const onSubmit = () => {
  if (!selectedAccount.value && !selectedTransferAccount.value) {
    return
  }

  amountError.value = !amount.value || amount.value > balance.value || (withdrawType.value === 'ExternalAddress' ? amount.value <= feeAmount.value : amount.value === 0)
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

const getIntervalGenerals = (key: IntervalKey, startAt: number, endAt: number, offset:number, limit: number) => {
  general.getIntervalGenerals({
    StartAt: startAt,
    EndAt: endAt,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GENERAL_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, key, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count === 0) {
      localledger.setLastDayGeneral(general.IntervalGenerals.get(key)?.Generals)
      return
    }
    getIntervalGenerals(key, startAt, endAt, limit + offset, limit)
  })
}

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
  }, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (count === 0) {
      localledger.initGeneral(general.Generals.Generals)
      getIntervalGenerals(
        IntervalKey.LastDay,
        Math.ceil(new Date().getTime() / 1000) - SecondsEachDay,
        Math.ceil(new Date().getTime() / 1000),
        0, 100)
      return
    }
    getUserGenerals(limit + offset, limit)
  })
}

const onCodeVerify = (code: string) => {
  submitting.value = true

  if (withdrawType.value === 'ExternalAddress') {
    ltransation.createWithdraw({
      CoinTypeID: coinTypeId.value,
      Amount: `${amount.value}`,
      AccountID: selectedAccount.value.Account.ID as string,
      VerificationCode: code,
      Account: account.value,
      AccountType: accountType.value,
      Message: {
        Error: {
          Title: t('MSG_SUBMIT_WITHDRAW_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (error: boolean) => {
      submitting.value = false
      if (error) {
        return
      }
      general.$reset()
      void router.push({ path: '/wallet' })
    })
  } else {
    transfer.createTransfer({
      Account: account.value,
      AccountType: accountType.value,
      VerificationCode: code,
      TargetUserID: selectedTransferAccount.value?.TargetUserID,
      Amount: `${amount.value}`,
      CoinTypeID: coinTypeId.value,
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

      ltransation.$reset()
      general.$reset()
      void router.push({ path: '/wallet' })
    })
  }
  verifing.value = false
}

const onStateTipBtnClick = () => {
  showWaiting.value = false
  showReviewing.value = false
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

  if (general.Generals.Generals.length === 0) {
    getUserGenerals(0, 100)
  }

  if (accounts.Accounts.filter((el) => {
    return el.Account.CoinTypeID === coinTypeId.value && el.State === ReviewState.Approved
  }).length === 0) {
    accounts.getWithdrawAccounts({
      Message: {}
    })
  }

  if (transferAccount.TransferAccounts.TransferAccounts.length === 0) {
    getTransferAccounts(0, 500)
  }
})

const onAddressSelected = (account: WithdrawAccount) => {
  selectedAccountIndex.value = withdraws.value.findIndex((el) => el.Account.ID === account.Account.ID)
}

const onTransferAccountSelected = (account: TransferAccount) => {
  selectedAccountIndex.value = transferAccounts.value.findIndex((el) => el.ID === account.ID)
}

</script>

<style lang='sass' scoped>
.wallet-type
  margin-right: 10px

.coin-type
  text-transform: uppercase !important
</style>
