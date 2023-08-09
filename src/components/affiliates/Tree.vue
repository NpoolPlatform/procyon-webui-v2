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
import { useLocalUserStore } from 'npool-cli-v4'
import { achievement } from 'src/teststore'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

const logined = useLocalUserStore()

const _archivement = achievement.useAchievementStore()
const inviter = computed(() => _archivement.achievement(logined?.User?.ID))
const invitees = computed(() => _archivement.inviteeAchievements(logined.User?.ID).sort((a, b) => a.InvitedAt > b.InvitedAt ? 1 : -1))
</script>
