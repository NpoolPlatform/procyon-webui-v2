<script setup lang='ts'>
import { AppID } from 'src/const/const'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppGood, NotifyType, useAdminAppGoodStore, useFrontendAppStore } from 'npool-cli-v4'
import { useLocalAppStore } from 'src/localstore/app'
import routes from 'src/router/routes'
import { RouteRecordRaw } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminAppGoodStore()
const application = useFrontendAppStore()
const newRoutes = ref([] as Array<RouteRecordRaw>)

watch(() => app.App?.Maintaining, () => {
  // TODO
})

onMounted(() => {
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  getApplication()

  if (!app.App?.Maintaining) {
    routes.forEach((el) => {
      if (el?.name === 'index') {
        el.path = '/testing'
      }
      if (el?.name === 'maintenance') {
        el.path = '/'
      }
      newRoutes.value.push(el)
    })
  }
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

const app = useLocalAppStore()
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
    app.setApp(application.App)
  })
}
</script>
