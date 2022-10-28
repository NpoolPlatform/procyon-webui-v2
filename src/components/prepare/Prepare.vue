<script setup lang='ts'>
import { useCoinStore, NotificationType, useCurrencyStore, Currency } from 'npool-cli-v2'
import { AppID } from 'src/const/const'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppGood, NotifyType, Promotion, Recommend, useAdminAppGoodStore, useAdminPromotionStore, useAdminRecommendStore, useFrontendAppStore } from 'npool-cli-v4'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useCoinStore()

const good = useAdminAppGoodStore()
const recommend = useAdminRecommendStore()
const promotion = useAdminPromotionStore()

const currency = useCurrencyStore()
const application = useFrontendAppStore()

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
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (promotion.Promotions.Promotions.length === 0) {
    getPromotions(0, 500)
  }
  if (recommend.Recommends.Recommends.length === 0) {
    getRecommends(0, 500)
  }
}

const getApplication = () => {
  application.getApp({
    AppID: AppID,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: NotifyType.Error
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

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<AppGood>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const getRecommends = (offset: number, limit: number) => {
  recommend.getRecommends({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_RECOMMENDS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<Recommend>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getRecommends(offset + limit, limit)
  })
}

const getPromotions = (offset: number, limit: number) => {
  promotion.getPromotions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_PROMOTIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<Promotion>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getPromotions(offset + limit, limit)
  })
}
</script>
