<script setup lang='ts'>
import { AppID } from 'src/const/const'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppGood, NotifyType, useAdminAppCoinStore, useAdminAppGoodStore, useFrontendAppStore } from 'npool-cli-v4'
import { getCoins } from 'src/api/chain'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminAppGoodStore()
const application = useFrontendAppStore()
const coin = useAdminAppCoinStore()

onMounted(() => {
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 500)
  }
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
</script>
