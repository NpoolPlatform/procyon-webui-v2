<template>
  <div :class='[ verifing ? "blur" : "" ]'>
    <FormPage @submit='onSubmit' label='MSG_NEW_WALLET_REGISTRATION' submit-text='MSG_REGISTER_ADDRESS'>
      <template #form-body>
        <CoinSelector
          v-model:selected-coin='selectedCoin' label='MSG_BLOCKCHAIN' :disabled='gotoWithdraw'
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
        :used-for='MessageUsedFor.SetWithdrawAddress'
        @cancel='onCancelClick'
        show-cancel
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { Coin, useAccountStore, MessageUsedFor, AccountType, NotificationType, useCoinStore } from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  coinTypeId: string;
  gotoWithdraw: boolean;
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coinTypeID = computed(() => query.value.coinTypeId)
const gotoWithdraw = computed(() => query.value.gotoWithdraw !== undefined)

const coin = useCoinStore()

const selectedCoinTypeID = ref(coinTypeID.value)

const selectedCoin = computed({
  get: () => coin.getCoinByID(selectedCoinTypeID.value),
  set: (val: Coin) => {
    selectedCoinTypeID.value = val.ID as string
  }
})

const accounts = useAccountStore()

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

const verifing = ref(false)

const onSubmit = () => {
  verifing.value = true
}

const onMenuHide = () => {
  if (selectedCoinTypeID.value.length === 0) {
    return
  }
  verifing.value = false
}

const account = ref('')
const accountType = ref(AccountType.Email)

const router = useRouter()

const onCancelClick = () => {
  verifing.value = false
}

const onCodeVerify = (code: string) => {
  accounts.setWithdrawAddress({
    CoinTypeID: selectedCoinTypeID.value,
    Address: address.value,
    Name: '',
    Message: '',
    Account: account.value,
    AccountType: accountType.value,
    VerificationCode: code,
    Labels: labels.value.split(','),
    NotifyMessage: {
      Error: {
        Title: t('MSG_SET_WITHDRAW_ADDRESS'),
        Message: t('MSG_SET_WITHDRAW_ADDRESS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
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
  verifing.value = false
}

onMounted(() => {
  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {}
    }, () => {
      // TODO
    })
  }
})

</script>

<style lang='sass' scoped>
.waring-gap
  margin: 24px 0
</style>
