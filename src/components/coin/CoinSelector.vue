<template>
  <UseCoin />
  <label for='coin' v-if='!hideLabel'>{{ $t('MSG_BLOCKCHAIN') }}</label>
  <select
    id='coin'
    :name='$t(label)'
    v-model='selectedCoin'
    required
    :disabled='disabled'
    @change='onChange'
  >
    <option
      v-for='_coin in coins'
      :key='_coin.ID'
      :value='_coin'
      :selected='selectedCoin?.CoinTypeID === _coin.CoinTypeID'
    >
      {{ _coin.Name }}
    </option>
  </select>
</template>

<script setup lang='ts'>
import { useAdminAppCoinStore } from 'npool-cli-v4'
import { computed, defineEmits, ref, defineProps, toRef, defineAsyncComponent } from 'vue'

const UseCoin = defineAsyncComponent(() => import('src/components/coin/UseCoin.vue'))

interface Props {
  id: string;
  label: string;
  disabled?: boolean;
  hideLabel?: boolean;
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const label = toRef(props, 'label')

const emit = defineEmits<{(e: 'update:id', id: string): void}>()

const coin = useAdminAppCoinStore()
const coins = computed(() => coin.AppCoins.AppCoins.filter((el) => !el.Disabled && !el.CoinDisabled && el.ForPay && el.CoinForPay && !el.Presale))

const target = ref(id.value)
const selectedCoin = computed({
  get: () => coin.getCoinByID(target.value),
  set: (val) => {
    target.value = val?.CoinTypeID as string
  }
})

const onChange = () => {
  emit('update:id', target.value)
}

</script>
