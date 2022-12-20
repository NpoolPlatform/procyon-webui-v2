<template>
  <h2>{{ $t('MSG_COMMISSION') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ totalCommission.toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ commissionJPY.toFixed(4) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }}
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useFrontendArchivementStore, useLocalUserStore, PriceCoinName, useAdminFiatCurrencyStore } from 'npool-cli-v4'

const logined = useLocalUserStore()

const archivement = useFrontendArchivementStore()
const inviter = computed(() => archivement.getArchivementByUserID(logined?.User.ID))

const totalCommission = computed(() => {
  let total = 0
  inviter.value?.Archivements.forEach((el) => {
    total += Number(el.TotalCommission)
  })
  return total
})

const fiat = useAdminFiatCurrencyStore()
const commissionJPY = computed(() => totalCommission.value * fiat.getJPYCurrency())

</script>
