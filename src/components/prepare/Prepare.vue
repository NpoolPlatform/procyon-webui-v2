<script setup lang='ts'>
import { useCoinStore, useGoodStore, NotificationType, useCurrencyStore, Currency, useApplicationStore } from 'npool-cli-v2'
import { AppID } from 'src/const/const'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()
const good = useGoodStore()
const currency = useCurrencyStore()
const application = useApplicationStore()

const getCurrencies = () => {
  currency.getAllCoinCurrencies({
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
}

const getCoins = () => {
  coin.getCoins({
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    getCurrencies()
  })
}

const getGoods = () => {
  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS'),
        Message: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  good.getPromotions({
    Message: {
      Error: {
        Title: t('MSG_GET_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })

  good.getAppGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
}

const getApplication = () => {
  application.getApplication({
    ID: AppID,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  getCoins()
  getGoods()
  getApplication()
})

</script>
