<template>
  <h2>{{ $t('MSG_COMMISSION') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ utils.getLocaleString(totalCommission, 2) }}</span>
      <span class='unit'>{{ constant.PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ utils.getLocaleString(commissionJPY) }}</span>
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
import { achievement, user, constant, fiatcurrency, utils } from 'src/npoolstore'

const logined = user.useLocalUserStore()
const _achievement = achievement.useAchievementStore()
const inviter = computed(() => _achievement.achievement(undefined, logined?.User.ID))

const totalCommission = computed(() => {
  let total = 0
  inviter.value?.Achievements.forEach((el) => {
    total += Number(el.TotalCommission)
  })
  return (Math.floor(total * 100)) / 100
})

const currency = fiatcurrency.useFiatCurrencyStore()
const commissionJPY = computed(() => {
  return Math.floor(totalCommission.value * currency.jpy())
})

</script>
