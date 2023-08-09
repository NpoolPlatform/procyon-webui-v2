<template>
  <h2>{{ $t('MSG_COMMISSION') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ util.getLocaleString(totalCommission, 2) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ util.getLocaleString(commissionJPY) }}</span>
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
import { useLocalUserStore, PriceCoinName, useAdminFiatCurrencyStore, useLocaleStringStore } from 'npool-cli-v4'
import { achievement } from 'src/teststore'

const logined = useLocalUserStore()
const util = useLocaleStringStore()
const _archivement = achievement.useAchievementStore()
const inviter = computed(() => _archivement.achievement(logined?.User.ID))

const totalCommission = computed(() => {
  let total = 0
  inviter.value?.Achievements.forEach((el) => {
    total += Number(el.TotalCommission)
  })
  return (Math.floor(total * 100)) / 100
})

const fiat = useAdminFiatCurrencyStore()
const commissionJPY = computed(() => {
  return Math.floor(totalCommission.value * fiat.getJPYCurrency())
})

</script>
