<template>
  <h2>{{ $t('MSG_COMMISSION') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ commission.Total.toFixed(4) }}</span>
      <span class='unit'>{{ PriceCoinName }}</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }} ({{ PriceCoinName }})
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>{{ commissionJPY.toFixed(4) }}</span>
      <span class='unit'>JPY</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_COMMISSION') }} (JPY)
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  Currency,
  useCurrencyStore,
  NotificationType,
  useBenefitStore,
  PriceCoinName
} from 'npool-cli-v2'
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const benefit = useBenefitStore()
const commission = computed(() => benefit.Commission)
const commissionJPY = ref(0)

watch(commission, () => {
  currency.getUSDTCurrency(Currency.JPY, (currency: number) => {
    commissionJPY.value = commission.value.Total * currency
  })
})

const currency = useCurrencyStore()

onMounted(() => {
  if (benefit.Commission.Total === 0) {
    benefit.getCommission({
      Message: {
        Error: {
          Title: t('MSG_GET_COMMISSION_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  currency.getUSDTCurrency(Currency.JPY, (currency: number) => {
    commissionJPY.value = commission.value.Total * currency
  })
})

</script>
