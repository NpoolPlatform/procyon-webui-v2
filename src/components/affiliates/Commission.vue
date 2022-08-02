<template>
  <h2>{{ $t('MSG_COMMISSION') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <!-- <span class='amount'>{{ commission.Total.toFixed(4) }}</span> -->
      <span class='amount'>{{ totalCommission }}</span>
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
import {
  Currency,
  useCurrencyStore,
  PriceCoinName,
  useLoginedUserStore
} from 'npool-cli-v2'
import { onMounted, ref, computed, watch } from 'vue'
// import { useI18n } from 'vue-i18n'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
// eslint-disable-next-line @typescript-eslint/unbound-method
// const { t } = useI18n({ useScope: 'global' })

// const benefit = useBenefitStore()
// const commission = computed(() => benefit.Commission)
const commissionJPY = ref(0)

const currency = useCurrencyStore()
const localArchivements = useLocalArchivementStore()
const logined = useLoginedUserStore()

const inviter = computed(() => {
  const index = localArchivements.Archivements.findIndex((el) => logined.LoginedUser?.User.ID === el.UserID)
  return index === -1 ? undefined : localArchivements.Archivements[index]
})

const totalCommission = computed(() => {
  let total = 0
  inviter.value?.Archivements.forEach((el) => {
    total += Number(el.TotalCommission)
  })
  return total
})
watch(totalCommission, () => {
  currency.getUSDTCurrency(Currency.JPY, (currency: number) => {
    commissionJPY.value = totalCommission.value * currency
  })
})
onMounted(() => {
  // if (benefit.Commission.Total === 0) {
  //   benefit.getCommission({
  //     Message: {
  //       Error: {
  //         Title: t('MSG_GET_COMMISSION_FAIL'),
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     // TODO
  //   })
  // }

  currency.getUSDTCurrency(Currency.JPY, (currency: number) => {
    commissionJPY.value = totalCommission.value * currency
  })
})

</script>
