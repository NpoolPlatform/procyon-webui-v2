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
                <span class='number'>{{ earning - withdrawdEarning }}</span>
                <span class='unit'>{{ coin.Unit }}</span>
              </div>
              <div class='full-section'>
                <h4>{{ $t('MSG_AMOUNT_TO_WITHDRAW') }} ({{ coin.Unit }}):</h4>
                <input type='number'>
              </div>

              <div class='full-section'>
                <h4>{{ $t('MSG_SELECT_RECIPIENT_ADDRESS') }}:</h4>
                <span
                  v-for='withdraw in withdraws'
                  :key='withdraw.Address.ID'
                  :class='[ "address-option", selectedAccount.Account.ID === withdraw.Account.ID ? "address-selected" : "" ]'
                >
                  <span class='wallet-type'>{{ withdraw.Address.Labels.join(',') }}</span>
                  <span class='wallet-type'>{{ coin.Name }}</span>
                  <span class='number'>{{ withdraw.Account.Address }}</span>
                  <img class='checkmark' :src='checkmark'>
                </span>
              </div>
            </div>
            <input type='submit' value='Withdraw' class='submit' @click='onSubmit'>
            <h3>Guide &amp; FAQ</h3>
            <h4>How can I withdraw my assets?</h4>
            <ul>
              <li>Enter the amount you would like to transfer and select the address you would like to transfer to.</li>
              <li>To add another address, please see the <a href=''>Dashboard page</a>.</li>
              <li><strong>Entering an invalid address will result in the permanent loss of your funds.</strong></li>
            </ul>

            <h4>How long does a transaction take?</h4>
            <ul>
              <li>For small amounts (as determined by the network) the transaction is approved automatically and should take a few minutes but <strong>can take a much as 24 hours</strong>, depending on network congestion and gas fees.</li>
              <li><strong>Large amounts (as determined by the network) will require manual processing</strong>, which takes up to 24 hours or more depending on the amount of transactions at the moment.</li>
            </ul>

            <h4>Where can I get a Spacemesh wallet?</h4>
            <ul>
              <li>Spacemesh will listed on big exchanges such as Coinbase and Binance.</li>
              <li>Be sure to <strong>use a Spacemesh wallet address</strong> to transfer your funds.</li>
              <li>Using an incorrect address will <strong>result in a loss of your SMH!</strong></li>
            </ul>
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
        @error='onCodeError'
        :used-for='MessageUsedFor.SetWithdrawAddress'
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { MessageUsedFor, AccountType, useCoinStore, totalWithdrawedEarningCoin, totalEarningCoin, useAccountStore, WithdrawAccount } from 'npool-cli-v2'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import checkmark from 'src/assets/icon-checkmark.svg'

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const verifing = ref(false)

interface Query {
  coinTypeId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const coins = useCoinStore()
const coinTypeId = computed(() => query.value.coinTypeId)
const coin = computed(() => coins.getCoinByID(coinTypeId.value))

const acounts = useAccountStore()
const withdraws = computed(() => acounts.Accounts.filter((account) => account.Account.CoinTypeID === coinTypeId.value))
const selectedAccount = ref(undefined as unknown as WithdrawAccount)

const earning = ref(0)
const withdrawdEarning = ref(0)

const onSubmit = () => {
  verifing.value = true
}

const onMenuHide = () => {
  verifing.value = false
}

const account = ref('')
const accountType = ref(AccountType.Email)

const onCodeVerify = (code: string) => {
  console.log('verify', code)
  verifing.value = false
}

const onCodeError = () => {
  verifing.value = false
}

onMounted(() => {
  totalEarningCoin(coinTypeId.value, (amount: number) => {
    earning.value = amount
    withdrawdEarning.value = totalWithdrawedEarningCoin(coinTypeId.value)
  })
})

</script>

<style lang='sass' scoped>
</style>
