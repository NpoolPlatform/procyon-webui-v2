<script setup lang='ts'>
import { AppID } from 'src/const/const'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppDefaultGood, AppGood, NotifyType, useAdminAppDefaultGoodStore, useAdminAppGoodStore, useFrontendAppStore } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const good = useAdminAppGoodStore()
const application = useFrontendAppStore()
const appDefaultGood = useAdminAppDefaultGoodStore()
const appDefaultGoods = computed(() => appDefaultGood.AppDefaultGoods.AppDefaultGoods)

onMounted(() => {
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (appDefaultGoods.value?.length === 0) {
    getAppDefaultGoods(0, 500)
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

const getAppDefaultGoods = (offset: number, limit: number) => {
  appDefaultGood.getAppDefaultGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_DEFAULT_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (rows: Array<AppDefaultGood>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getAppDefaultGoods(offset + limit, limit)
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
