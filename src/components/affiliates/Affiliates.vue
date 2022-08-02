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
import { useInspireStore, NotificationType } from 'npool-cli-v2'
import { useArchivementStore } from 'src/teststore/mock/archivement'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Commission = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const localArchivements = useLocalArchivementStore()
const archivement = useArchivementStore()
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
    if (offset >= archivement.Total) { // local
      localArchivements.$reset()
      localArchivements.Total = archivement.Total
      localArchivements.addArchivement(archivement.Archivements)
      return
    }
    getArchivements(offset + limit, limit) // recursive get archivement
  })
}

const inspire = useInspireStore()
onMounted(() => {
  // if (!inspire.InvitationCode?.InvitationCode?.length) {
  //   inspire.getInvitationCode({
  //     Message: {
  //       Error: {
  //         Title: t('MSG_GET_INVITATION_CODE_FAIL'),
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   })
  // }

  archivement.$reset() // call reset method before request
  getArchivements(0, 100)
})

</script>
