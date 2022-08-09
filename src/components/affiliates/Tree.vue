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
      v-for='(referral, idx) in referrals'
      :key='referral.UserID'
      :child='true'
      :first-child='idx === 0'
      :last-child='idx === referrals.length - 1'
      :referral='referral'
    />
  </div>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { useLoginedUserStore } from 'npool-cli-v2'
import { LocalProductArchivement } from 'src/localstore/affiliates/types'
import { useLocalArchivementStore } from 'src/localstore/affiliates'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

const logined = useLoginedUserStore()
const localArchivements = useLocalArchivementStore()

const referrals = computed(() => localArchivements.Archivements.filter((el) => el.Kol && logined.LoginedUser?.User.ID !== el.UserID))
const inviter = computed(() => {
  const index = localArchivements.Archivements.findIndex((el) => el.UserID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivements.Archivements[index]
})

</script>
