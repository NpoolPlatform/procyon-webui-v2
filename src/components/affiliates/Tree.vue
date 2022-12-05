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
import { useFrontendArchivementStore, useLocalUserStore } from 'npool-cli-v4'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

const logined = useLocalUserStore()

const archivement = useFrontendArchivementStore()
const inviter = computed(() => archivement.getArchivementByUserID(logined?.User?.ID))
const invitees = computed(() => archivement.getInviteesArchivements(logined.User?.ID).sort((a, b) => a.InvitedAt > b.InvitedAt ? 1 : -1))
</script>
