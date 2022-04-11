<template>
  <div :class='[ verifing ? "blur" : "" ]'>
    <BackPage>
      <div class='content order-page'>
        <div class='product-container'>
          <div class='product-title-section'>
            <div class='product-page-icon'><img src='product-spacemesh.svg'></div>
            <h1>Spacemesh</h1>
          </div>
          <div class='withdraw'>
            <h3>Asset Withdrawal</h3>
            <div class='info-flex'>
              <div class='full-section'>
                <h4>Available for Withdrawal:</h4>
                <span class='number'>10</span>
                <span class='unit'>SMH</span>
              </div>
              <div class='full-section'>
                <h4>Amount to Withdraw (SMH):</h4>
                <input type='number'>
              </div>

              <div class='full-section'>
                <h4>Select Recipient Address:</h4>
                <span class='address-option'>
                  <span class='wallet-type'>MetaMask</span>
                  <span class='wallet-type'>ERC20</span>
                  <span class='number'>fdaxjsaioxashcarueytyd8743y7898ash8x9xsa890</span>
                  <img class='checkmark' src='icon-checkmark.svg'>
                </span>
                <span class='address-option address-selected'>
                  <span class='wallet-type'>Coinbase</span>
                  <span class='wallet-type'>SMH</span>
                  <span class='number'>sa890a3y7898xjfdh8x9xsaioxashcarueytyd874as</span>
                  <img class='checkmark' src='icon-checkmark.svg'>
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
import { MessageUsedFor, AccountType } from 'npool-cli-v2'
import { ref, defineAsyncComponent } from 'vue'

const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const verifing = ref(false)

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

</script>

<style lang='sass' scoped>
</style>
