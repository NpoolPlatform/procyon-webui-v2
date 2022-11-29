<template>
  <div :class='[ verifying ? "blur" : "" ]'>
    <FormPage @submit='onSubmit' label='MSG_NEW_WALLET_REGISTRATION' submit-text='MSG_REGISTER_ADDRESS'>
      <template #form-body>
        <CoinSelector
          v-model:id='selectedCoinTypeID' label='MSG_BLOCKCHAIN' :disabled='gotoWithdraw'
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
        :used-for='UsedFor.SetWithdrawAddress'
        @cancel='onCancelClick'
        show-cancel
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { UsedFor, AccountType, NotifyType, useFrontendUserAccountStore, SignMethodType, AccountUsedFor } from 'npool-cli-v4'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  coinTypeID: string;
  gotoWithdraw: boolean;
}

const route = useRoute()
const router = useRouter()

const query = computed(() => route.query as unknown as Query)
const coinTypeID = computed(() => query.value.coinTypeID)
const gotoWithdraw = computed(() => query.value.gotoWithdraw !== undefined)

const selectedCoinTypeID = ref(coinTypeID.value)

const address = ref('')
const addressError = ref(false)
const onAddressFocusIn = () => {
  addressError.value = false
}
const onAddressFocusOut = () => {
  addressError.value = !address.value.length
}

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
  verifying.value = false
}

const account = ref('')
const accountType = ref(AccountType.Email)

const userAccount = useFrontendUserAccountStore()

const onCodeVerify = (code: string) => {
  userAccount.createUserAccount({
    CoinTypeID: selectedCoinTypeID.value,
    Address: address.value,
    Account: account.value,
    AccountType: accountType.value as unknown as SignMethodType,
    VerificationCode: code,
    Labels: labels.value?.split(','),
    UsedFor: AccountUsedFor.UserWithdraw,
    Message: {
      Error: {
        Title: t('MSG_SET_WITHDRAW_ADDRESS'),
        Message: t('MSG_SET_WITHDRAW_ADDRESS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    if (gotoWithdraw.value) {
      void router.push({
        path: '/withdraw',
        query: {
          coinTypeId: selectedCoinTypeID.value
        }
      })
      return
    }
    void router.back()
  })
  verifying.value = false
}

</script>

<style lang='sass' scoped>
.waring-gap
  margin: 24px 0
</style>
