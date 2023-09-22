<template>
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
      v-for='_coin in displayCoins'
      :key='_coin.ID'
      :value='_coin'
      :selected='selectedCoin?.CoinTypeID === _coin.CoinTypeID'
    >
      {{ coinLabel(_coin) }}
    </option>
  </select>
</template>

<script setup lang='ts'>
import { computed, defineEmits, ref, defineProps, toRef, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { appcoin, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  id: string
  label: string
  disabled?: boolean
  hideLabel?: boolean
  coins?: Array<appcoin.AppCoin>
  default?: boolean
  nameIndex?: number
  tipIndex?: number
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const label = toRef(props, 'label')
const coins = toRef(props, 'coins')
const setDefaultValue = toRef(props, 'default')
const nameIndex = toRef(props, 'nameIndex')
const tipIndex = toRef(props, 'tipIndex')

const coinLabel = (coin: appcoin.AppCoin) => {
  let label = coin.Name
  if (nameIndex.value !== undefined && nameIndex.value >= 0 && coin.DisplayNames?.length > nameIndex.value && coin.DisplayNames[nameIndex.value]?.length > 0) {
    label = coin.DisplayNames[nameIndex.value]
  }
  if (tipIndex.value !== undefined && tipIndex.value >= 0 && coin.SettleTips?.length > tipIndex.value && coin.SettleTips[tipIndex.value]?.length > 0) {
    label += ' (' + t(coin.SettleTips[tipIndex.value]).toUpperCase() + ')'
  }
  return label
}

const emit = defineEmits<{(e: 'update:id', id: string): void;}>()

const coin = appcoin.useAppCoinStore()
const displayCoins = computed(() => coins.value || coin.coins(undefined).filter((el) => !el.Presale && el.Display))

const target = ref(id.value)
const selectedCoin = computed({
  get: () => coin.coin(undefined, target.value),
  set: (val) => {
    target.value = val?.CoinTypeID as string
  }
})

watch([() => displayCoins.value], () => {
  if (coins.value?.length && setDefaultValue.value) {
    setDefault()
  }
})

const onChange = () => {
  emit('update:id', target.value)
}

const setDefault = () => {
  target.value = displayCoins?.value[0]?.CoinTypeID
  emit('update:id', target.value)
}

onMounted(() => {
  if (!coins.value) {
    if (!coin.coins(undefined).length) {
      getCoins(0, 100)
    }
  }

  if (!target.value && setDefaultValue.value) setDefault()
})

const getCoins = (offset: number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcoin.AppCoin>) => {
    if (error || !rows?.length) {
      if (!target.value && setDefaultValue.value) setDefault()
      return
    }
    getCoins(offset + limit, limit)
  })
}
</script>
