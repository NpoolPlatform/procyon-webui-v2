<template>
  <div :class='[ verifying ? "blur" : "" ]'>
    <FormPage @submit='onSubmit' label='MSG_NEW_WALLET_REGISTRATION' submit-text='MSG_REGISTER_ADDRESS' :submitting='submitting'>
      <template #form-body>
        <CoinSelector
          v-model:id='selectedCoinTypeID'
          label='MSG_BLOCKCHAIN'
          :disabled='gotoWithdraw'
          :tip-index='2'
          :name-index='2'
        />
        <Input
          v-model:value='address'
          label='MSG_WALLET_ADDRESS'
          type='text'
          id='address'
          required
          :error='addressError'
          message='MSG_ADDRESS_TIP'
          placeholder='MSG_ADDRESS_PLACEHOLDER'
          @focus='onAddressFocusIn'
          @blur='onAddressFocusOut'
        />
        <div class='warning waring-gap'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t("MSG_WITHDRAW_ADDRESS_WARNING")' />
        </div>
        <template v-if='needMemo'>
          <Input
            v-model:value='memo'
            label='MSG_MEMO'
            type='text'
            id='memo'
            :required='false'
            placeholder='MSG_MEMO_PLACEHOLDER'
            message=''
            :error='memoError'
          />
          <div class='warning waring-gap'>
            <img src='font-awesome/warning.svg'>
            <span v-html='$t("MSG_WITHDRAW_MEMO_WARNING")' />
          </div>
        </template>
        <Input
          v-model:value='labels'
          label='MSG_WALLET_ADDRESS_LABELS'
          caption='MSG_WALLET_ADDRESS_LABELS_TIP'
          type='text'
          id='address'
          :required='false'
          :error='labelsError'
          message=''
          placeholder='MSG_ADDRESS_LABELS_PLACEHOLDER'
        />
      </template>
      <template #append-submit>
        <h3>{{ $t('MSG_CAUTION') }}</h3>
        <p v-html='$t("MSG_WALLET_ADDRESS_CAUTION_CONTENT")' />
      </template>
    </FormPage>
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
        :used-for='basetypes.EventType.SetWithdrawAddress'
        @cancel='onCancelClick'
        show-cancel
        :disabled='submitting'
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useraccount, basetypes, accountbase, notify, appcoin, appuserbase } from 'src/npoolstore'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

interface Query {
  coinTypeID: string
  gotoWithdraw: boolean
}

const route = useRoute()
const router = useRouter()

const query = computed(() => route.query as unknown as Query)
const coinTypeID = computed(() => query.value.coinTypeID)
const gotoWithdraw = computed(() => query.value.gotoWithdraw !== undefined)

const selectedCoinTypeID = ref(coinTypeID.value)

const coin = appcoin.useAppCoinStore()
const needMemo = computed(() => coin.needMemo(undefined, selectedCoinTypeID.value))

const address = ref('')
const addressError = ref(false)
const onAddressFocusIn = () => {
  addressError.value = false
}
const onAddressFocusOut = () => {
  addressError.value = !address.value.length
}

const memo = ref('')
const memoError = ref(false)

const labels = ref('')
const labelsError = ref(false)

const verifying = ref(false)
const onSubmit = () => {
  verifying.value = true
}

const onMenuHide = () => {
  if (selectedCoinTypeID.value.length === 0) {
    return
  }
  verifying.value = false
}

const onCancelClick = () => {
  onMenuHide()
}

const account = ref('')
const accountType = ref(appuserbase.SignMethodType.Email)
const userAccount = useraccount.useUserAccountStore()

const submitting = ref(false)

const onCodeVerify = (code: string) => {
  submitting.value = true
  const _memo = memo.value === '' ? undefined : memo.value
  userAccount.createUserAccount({
    CoinTypeID: selectedCoinTypeID.value,
    Address: address.value,
    Account: accountType.value === appuserbase.SignMethodType.Google ? undefined as unknown as string : account.value,
    Memo: _memo,
    AccountType: accountType.value as unknown as appuserbase.SignMethodType,
    VerificationCode: code,
    Labels: labels.value?.split(','),
    UsedFor: accountbase.AccountUsedFor.UserWithdraw,
    Message: {
      Error: {
        Title: 'MSG_SET_WITHDRAW_ADDRESS',
        Message: 'MSG_SET_WITHDRAW_ADDRESS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      submitting.value = false
      onMenuHide()
      return
    }

    if (gotoWithdraw.value) {
      void router.push({
        path: '/withdraw',
        query: {
          coinTypeID: selectedCoinTypeID.value
        }
      })
      submitting.value = false
      return
    }
    void router.back()
    submitting.value = false
  })
}

</script>

<style lang='sass' scoped>
.waring-gap
  margin-top: 8px
  margin-bottom: 24px
</style>
