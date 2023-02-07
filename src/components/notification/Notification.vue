<template>
  <div class='content'>
    <h2>{{ $t('MSG_NOTIFICATIONS') }}</h2>
    <ul class='notification-center'>
      <li v-for='row in notifications' :key='row.ID'>
        <span class='top'>
          <span class='date'>{{ formatTime(row?.CreatedAt, true) }}</span>
          <span class='title'>{{ row.EventType }}</span>
        </span>
        {{ row.Content }}
        <a v-if='notif.goWalletPage(row)' href='#/wallet'>{{ $t('MSG_WALLET') }}</a>
        <a v-if='notif.goPersonPage(row)' href='#/person'>{{ $t('MSG_PERSONAL_INFO') }}</a>
        {{ $t('MSG_FOR_DETAILS') }}.
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { useFrontendNotifStore } from 'src/teststore/mock/notify'
import { computed, onMounted } from 'vue'
import { formatTime } from 'npool-cli-v4/utils'
import { getNotifs } from 'src/api/notif'

const notif = useFrontendNotifStore()
const notifications = computed(() => notif.Notifs.Notifs)

onMounted(() => {
  if (notifications.value?.length === 0) {
    getNotifs(0, 500)
  }
})
</script>
