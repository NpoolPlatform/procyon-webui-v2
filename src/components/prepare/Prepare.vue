<script setup lang='ts'>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { app, appgood, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = appgood.useAppGoodStore()
const application = app.useApplicationStore()

onMounted(() => {
  if (!good.goods(undefined)) {
    getAppGoods(0, 100)
  }
  getApplication()
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, g?: Array<appgood.Good>) => {
    if (error || !g?.length) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}

const getApplication = () => {
  application.getApp({
    Message: {
      Error: {
        Title: t('MSG_GET_APP'),
        Message: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
