<template>
  <div v-if='!hidden'>
    <h2>{{ $t('MSG_ACCOUNT_BALANCE') }}</h2>
    <div class='earnings-summary'>
      <div class='earnings-figure'>
        <span class='amount'>{{ totalUSDTBalance.toFixed(4) }}</span>
        <span class='unit'>{{ PriceCoinName }}</span>
        <div class='hr' />
        <h4 class='description'>
          {{ $t('MSG_CURRENT_BALANCE') }} ({{ PriceCoinName }})
        </h4>
      </div>
      <div class='earnings-figure'>
        <span class='amount'>{{ totalJPYBalance.toFixed(4) }}</span>
        <span class='unit'>JPY</span>
        <div class='hr' />
        <h4 class='description'>
          {{ $t('MSG_CURRENT_BALANCE') }} (JPY)
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { PriceCoinName } from 'npool-cli-v2'
import { useLocalLedgerStore } from 'src/localstore/ledger'
import { defineProps, toRef, computed } from 'vue'

interface Props {
  hidden?: boolean;
}

const props = defineProps<Props>()
const hidden = toRef(props, 'hidden')

const localledger = useLocalLedgerStore()

const totalUSDTBalance = computed(() => localledger.toUsdtAmount)
const totalJPYBalance = computed(() => localledger.toJpyAmount)

</script>
