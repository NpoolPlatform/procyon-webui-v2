<template>
  <h2>{{ $t('MSG_AFFILIATE_TREE') }}</h2>
  <div class='aff-tree'>
    <Card
      v-if='inviter'
      :child='false'
      :first-child='false'
      :last-child='false'
      :referral='inviter'
    />
    <Card
      v-for='(referral, idx) in invitees'
      :key='referral.UserID'
      :child='true'
      :first-child='idx === 0'
      :last-child='idx === invitees.length - 1'
      :referral='referral'
    />
  </div>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { useAdminAppGoodStore, useFrontendArchivementStore, useLocalUserStore, UserArchivement } from 'npool-cli-v4'
import { MyArchivement, MyGoodArchivement } from 'src/localstore/ledger/types'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

const logined = useLocalUserStore()
const good = useAdminAppGoodStore()

const archivement = useFrontendArchivementStore()
const inviter = computed(() => {
  const userArchivement = archivement.getArchivementByUserID(logined?.User?.ID) as UserArchivement
  if (!userArchivement) return {} as MyArchivement
  const goodArchivements = Array.from(userArchivement?.Archivements?.filter?.((el) => good.visible(el.GoodID))).map((el) => {
    return { ...el, Editing: false } as MyGoodArchivement
  })
  return { ...userArchivement, Archivements: goodArchivements } as MyArchivement
})

const invitees = computed(() => archivement.getInviteesArchivements(logined.User?.ID).map((el) => {
  const goodArchivements = Array.from(el.Archivements.filter((el) => good.visible(el.GoodID))).map((el) => {
    return { ...el, Editing: false } as MyGoodArchivement
  })
  return { ...el, Archivements: goodArchivements } as MyArchivement
}))
</script>
