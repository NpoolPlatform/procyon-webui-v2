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
import { AppCoin, NotifyType, useAdminAppCoinStore } from 'npool-cli-v4'
import { computed, defineEmits, ref, defineProps, toRef, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  id: string;
  label: string;
  disabled?: boolean;
  hideLabel?: boolean;
  coins?: Array<AppCoin>;
  default?: boolean;
  nameIndex?: number;
  tipIndex?: number;
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const label = toRef(props, 'label')
const coins = toRef(props, 'coins')
const setDefaultValue = toRef(props, 'default')
const nameIndex = toRef(props, 'nameIndex')
const tipIndex = toRef(props, 'tipIndex')

const coinLabel = (coin: AppCoin) => {
  let label = coin.Name
  if (nameIndex.value !== undefined && nameIndex.value >= 0 && coin.DisplayNames.length > nameIndex.value && coin.DisplayNames[nameIndex.value].length > 0) {
    label = coin.DisplayNames[nameIndex.value]
  }
  if (tipIndex.value !== undefined && tipIndex.value >= 0 && coin.SettleTips.length > tipIndex.value && coin.SettleTips[tipIndex.value].length > 0) {
    label += '(' + coin.SettleTips[tipIndex.value] + ')'
  }
  return label
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()

const coin = useAdminAppCoinStore()
const displayCoins = computed(() => !coins.value ? coin.AppCoins.AppCoins.filter((el) => !el.Presale && el.Display) : coins.value)

const target = ref(id.value)
const selectedCoin = computed({
  get: () => coin.getCoinByID(target.value),
  set: (val) => {
    target.value = val?.CoinTypeID as string
  }
})

watch([() => displayCoins.value], () => {
  if (coins.value && coins.value.length > 0 && setDefaultValue) {
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
    if (coin.AppCoins.AppCoins.length === 0) {
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
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCoin>) => {
    if (error || rows.length < limit) {
      if (!target.value && setDefaultValue.value) setDefault()
      return
    }
    getCoins(offset + limit, limit)
  })
}
</script>
