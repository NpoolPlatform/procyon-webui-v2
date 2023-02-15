<template>
  <div class='content'>
    <h2>{{ $t('MSG_NOTIFICATION_CENTER') }}</h2>
    <ul class='notification-center'>
      <li class='first'>
        <span>
          <!-- <span class='number'>{{ unReads?.length }}</span> -->
          <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: unReads.length})' />
          <!-- {{ $t('MSG_NEW_NOTIFICATIONS',{TOTAL: unReads.length}) }} -->
          <span class='clear-all'>
            <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
          </span>
        </span>
      </li>
      <NotifCard v-for='row in notifications' :key='row.ID' :notif='row' />
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useFrontendNotifStore } from 'npool-cli-v4'
import { getNotifs, onMarkAll } from 'src/api/notif'

const NotifCard = defineAsyncComponent(() => import('src/components/notification/NotifCard.vue'))

const notif = useFrontendNotifStore()
const notifications = computed(() => notif.notifs)
const unReads = computed(() => notif.unReads)

onMounted(() => {
  if (notifications.value?.length === 0) {
    getNotifs(0, 500)
  }
})

</script>
