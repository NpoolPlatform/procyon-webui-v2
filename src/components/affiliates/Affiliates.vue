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
</template>

<script setup lang='ts'>
import { NotificationType, useGoodStore, useInspireStore } from 'npool-cli-v2'
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

const archivement = useArchivementStore()
const larchivement = useLocalArchivementStore()

const getArchivements = (offset: number, limit: number) => {
  archivement.getCoinArchivements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    console.log(archivement.Archivements)
    if (archivement.Archivements.Total <= archivement.Archivements.Archivements.length) {
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

  if (archivement.Archivements.Archivements.length === 0) {
    getArchivements(0, 100)
  }

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
})

</script>
