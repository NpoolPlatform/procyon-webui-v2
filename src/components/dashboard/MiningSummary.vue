<template>
  <h2>{{ $t('MSG_EARNINGS') }}</h2>
  <div class='earnings-summary'>
    <div class='earnings-figure'>
      <span class='amount'>{{ totalEarning }}</span>
      <span class='unit'>USDT</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_TOTAL_EARNINGS') }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>*</span>
      <span class='unit'>USDT</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_YESTERDAY_EARNING') }}
      </h4>
    </div>
    <div class='earnings-figure'>
      <span class='amount'>*</span>
      <span class='unit'>USDT</span>
      <div class='hr' />
      <h4 class='description'>
        {{ $t('MSG_CURRENT_BALANCE') }}
      </h4>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Currency, totalEarningUSD, useCurrencyStore, NotificationType, useCoinStore } from 'npool-cli-v2'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const totalEarning = ref(0)

const currency = useCurrencyStore()
const coin = useCoinStore()

onMounted(() => {
  currency.getCoinCurrencies({
    Currencies: [Currency.USD],
    Message: {
      Error: {
        Title: t('MSG_GET_CURRENCIES'),
        Message: t('MSG_GET_CURRENCIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  coin.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })

  totalEarningUSD((usdAmount: number) => {
    totalEarning.value = usdAmount
  })
})

</script>
