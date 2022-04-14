<template>
  <label for='coin'>{{ $t('MSG_BLOCKCHAIN') }}</label>
  <select id='coin' :name='$t(label)' v-model='myCoin' required>
    <option
      v-for='_myCoin in coins'
      :key='_myCoin.ID'
      :value='_myCoin'
      :selected='myCoin?.ID === _myCoin.ID'
    >
      {{ _myCoin.Unit }} ({{ _myCoin.Name }})
    </option>
  </select>
</template>

<script setup lang='ts'>
import { computed, defineEmits, ref, watch, defineProps, toRef, onMounted } from 'vue'
import { useCoinStore, Coin, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

interface Props {
  selectedCoin: Coin
  label: string
}

const props = defineProps<Props>()
const selectedCoin = toRef(props, 'selectedCoin')
const label = toRef(props, 'label')

const coin = useCoinStore()
const coins = computed(() => coin.Coins.filter((coin) => !coin.PreSale))
const myCoin = ref(selectedCoin.value)

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const emit = defineEmits<{(e: 'update:selectedCoin', coin: Coin): void}>()
watch(myCoin, () => {
  emit('update:selectedCoin', myCoin.value)
})

onMounted(() => {
  if (coins.value.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>
