<template>
  <div :class='[ verifying || showReviewing || showWaiting ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container content-glass'>
          <div class='product-title-section'>
            <div class='product-page-icon' />
            <h1>{{ $t('MSG_TRANSFER_ASSET') }}</h1>
          </div>
          <div class='withdraw'>
            <h3>{{ $t('MSG_TRANSFER_TO') }} : {{ targetUsername }}</h3>
            <div class='info-flex'>
              <div class='three-section'>
                <h4>{{ $t('MSG_AVAILABLE_COIN') }}:</h4>
                <select
                  id='coin' v-model='selectedCoin'
                  required
                >
                  <option
                    v-for='_balance in coinBalanceGenerals'
                    :key='_balance.CoinTypeID'
                    :value='_balance'
                    :selected='_balance?.CoinTypeID === _balance.CoinTypeID'
                  >
                    {{ coinName(_balance.CoinTypeID ) }}
                  </option>
                </select>
                <span />
              </div>
              <div class='three-section'>
                <h4>{{ $t('MSG_AVAILABLE_FOR_TRANSFER') }}:</h4>
                <span class='number'>{{ selectedCoin?.Balance }}</span>
                <span class='unit'>{{ selectedCoin?.CoinUnit }}</span>
              </div>
              <div class='full-section'>
                <h4>{{ $t('MSG_AMOUNT_TO_TRANSFER') }} ({{ selectedCoin?.CoinUnit }}):</h4>
                <Input
                  v-model:value='amount'
                  type='number'
                  id='amount'
                  required
                  :error='amountError'
                  message='MSG_AMOUNT_TIP'
                  placeholder='MSG_AMOUNT_PLACEHOLDER'
                  :min='0'
                  :max='selectedCoin?.Balance'
                  @focus='onAmountFocusIn'
                  @blur='onAmountFocusOut'
                  class='transfer-amount'
                />
              </div>
            </div>
            <div class='submit transfer-btn'>
              <WaitingBtn
                label='MSG_TRANSFER'
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
        :used-for='MessageUsedFor.UsedForTransfer'
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
  NotificationType,
  SecondsEachDay,
  useCoinStore
} from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGeneralStore } from 'src/teststore/mock/ledger'
import { BalanceGeneral, useLocalLedgerStore } from 'src/localstore/ledger'
import { IntervalKey } from 'src/const/const'
import { useLocalCoinStore } from 'src/localstore/coin'
import { NotifyType, Transfer, TransferAccount, useFrontendTransferAccountStore, useFrontendTransferStore, AccountType } from 'npool-cli-v4'
import { useLocalTransactionStore } from 'src/teststore/mock/transaction'

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  transferID: string;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const transferAccount = useFrontendTransferAccountStore()
const targetAccount = computed(() => transferAccount.TransferAccounts.TransferAccounts.find((el) => el.ID === query.value.transferID))
const targetUsername = computed(() => {
  if (!targetAccount.value) {
    return ''
  }
  return targetAccount.value.TargetEmailAddress.length > 0 ? targetAccount.value.TargetEmailAddress : targetAccount.value.TargetPhoneNO
})

const localledger = useLocalLedgerStore()
const coinBalanceGenerals = computed(() => {
  return localledger.generals.filter((el) => !preSaleCoin(el.CoinTypeID) && !coinBlacklist(el.CoinTypeID) && el.Balance > 0)
})

const coin = useCoinStore()
const preSaleCoin = (coinTypeID: string) => {
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  return existingItem.PreSale
}
const coinBlacklist = (coinTypeID: string) => {
  const names = ['Ethereum', 'Tron', 'Solana', 'USD Coin']
  const existingItem = coin.Coins.find((el) => el.ID === coinTypeID)
  if (!existingItem) {
    return true
  }
  let flag = false
  names.forEach((el) => {
    if (existingItem.Name?.toLowerCase().includes(el.toLowerCase())) {
      flag = true
    }
  })
  return flag
}

const localcoin = useLocalCoinStore()
const coinName = computed(() => (ID: string) => localcoin.formatCoinName(ID))

const verifying = ref(false)
const showReviewing = ref(false)
const showWaiting = ref(true)

const amount = ref(0)
const amountError = ref(false)
const onAmountFocusIn = () => {
  amountError.value = false
}
const onAmountFocusOut = () => {
  amountError.value = !amount.value || amount.value > selectedCoin.value.Balance || amount.value <= 0
}

const submitting = ref(false)

const general = useGeneralStore()
const selectedCoin = ref(coinBalanceGenerals.value.length > 0 ? coinBalanceGenerals.value[0] : {} as BalanceGeneral)

const onSubmit = () => {
  if (!selectedCoin.value) {
    return
  }

  amountError.value = !amount.value || amount.value > selectedCoin.value.Balance || amount.value <= 0
  if (amountError.value) {
    return
  }
  verifying.value = true
}

const onMenuHide = () => {
  verifying.value = false
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
const localtrans = useLocalTransactionStore()
const transfer = useFrontendTransferStore()
const onCodeVerify = (code: string) => {
  submitting.value = true
  transfer.createTransfer({
    Account: account.value,
    AccountType: accountType.value,
    VerificationCode: code,
    TargetUserID: targetAccount.value?.TargetUserID as string,
    Amount: `${amount.value}`,
    CoinTypeID: selectedCoin.value.CoinTypeID,
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

    localtrans.$reset()
    general.$reset()
    void router.push({ path: '/wallet' })
  })
  verifying.value = false
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
  if (general.Generals.Generals.length === 0) {
    getUserGenerals(0, 100)
  }
  if (transferAccount.TransferAccounts.TransferAccounts.length === 0) {
    getTransferAccounts(0, 500)
  }
})
</script>

<style lang='sass' scoped>
.wallet-type
  margin-right: 10px

.coin-type
  text-transform: uppercase !important
.full-section ::v-deep input
  width: 323px
.transfer-btn ::v-deep button
  width: 323px
</style>
