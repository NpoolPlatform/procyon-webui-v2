<template>
  <div class='content' v-if='inspire.InvitationCode?.InvitationCode?.length'>
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
    skip-hijack
  />
</template>

<script setup lang='ts'>
import { NotificationType, useCoinStore, useGoodStore, useInspireStore } from 'npool-cli-v2'
import { QAjaxBar } from 'quasar'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
import { useArchivementStore } from 'src/teststore/mock/archivement'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Commission = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const archivement = useArchivementStore()
const larchivement = useLocalArchivementStore()
const coin = useCoinStore()

const progress = ref<QAjaxBar>()

const getArchivements = (offset: number, limit: number) => {
  progress.value?.start()
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
  }, () => {
    if (archivement.Archivements.Total <= archivement.Archivements.Archivements.length) {
      progress.value?.stop()
      larchivement.$reset()
      larchivement.addArchivement(archivement.Archivements.Archivements)
      larchivement.Total = archivement.Archivements.Total
      return
    }
    getArchivements(offset + limit, limit)
  })
}

const inspire = useInspireStore()
const good = useGoodStore()
onMounted(() => {
  if (!inspire.InvitationCode?.InvitationCode?.length) {
    inspire.getInvitationCode({
      Message: {
        Error: {
          Title: t('MSG_GET_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
  archivement.$reset()
  getArchivements(0, 100)

  if (good.AppGoods.length === 0) {
    good.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
    // NOTHING TODO
    })
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

  if (coin.Coins.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>
