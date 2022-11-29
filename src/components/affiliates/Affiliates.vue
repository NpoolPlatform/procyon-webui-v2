<template>
  <div class='content' v-if='user.User.InvitationCode?.length'>
    <Commission />
    <div class='hr' />
    <ReferralCode />
    <div class='hr' />
    <Tree />
    <div class='hr' />
    <Table />
    <div class='hr' />
  </div>
  <q-ajax-bar
    ref='progress'
    position='top'
    color='green-2'
    size='6px'
  />
</template>

<script setup lang='ts'>
import { NotificationType, useInspireStore } from 'npool-cli-v2'
import { useLocalUserStore, useAdminAppGoodStore, NotifyType, AppGood, useAdminAppCoinStore } from 'npool-cli-v4'
import { QAjaxBar } from 'quasar'
import { getCoins } from 'src/api/coin'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
import { useArchivementStore } from 'src/teststore/mock/archivement'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Commission = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const user = useLocalUserStore()
const archivement = useArchivementStore()
const larchivement = useLocalArchivementStore()

const inspire = useInspireStore()

const getArchivements = (offset: number, limit: number) => {
  archivement.getCoinArchivements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COIN_ARCHIVEMENT_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean, count?: number) => {
    if (error) {
      return
    }
    if (!count || count <= 1) {
      larchivement.$reset()
      larchivement.addArchivement(archivement.Archivements.Archivements)
      larchivement.Total = archivement.Archivements.Total
      return
    }
    getArchivements(offset + limit, limit)
  })
}

const good = useAdminAppGoodStore()

const coin = useAdminAppCoinStore()

onMounted(() => {
  if (larchivement.Archivements.length === 0) {
    getArchivements(0, 100)
  }

  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }

  if (inspire.PurchaseAmountSettings.length === 0) {
    inspire.getPurchaseAmountSettings({
      Message: {
        Error: {
          Title: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
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
</script>
