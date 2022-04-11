<template>
  <FormPage @submit='onSubmit' label='MSG_NEW_WALLET_REGISTRATION' submit-text='MSG_REGISTER_ADDRESS'>
    <template #form-body>
      <CoinSelector v-model:selected-coin='selectedCoin' label='MSG_BLOCKCHAIN' />
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
      <Input
        v-model:value='labels'
        label='MSG_WALLET_ADDRESS_LABELS'
        caption='MSG_WALLET_ADDRESS_LABELS_TIP'
        type='text'
        id='address'
        required
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
</template>

<script setup lang='ts'>
import { Coin } from 'npool-cli-v2'
import { ref, defineAsyncComponent } from 'vue'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const CoinSelector = defineAsyncComponent(() => import('src/components/coin/CoinSelector.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const selectedCoin = ref(undefined as unknown as Coin)

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

const onSubmit = () => {
  // TODO
}

</script>

<style lang='sass' scoped>
</style>
