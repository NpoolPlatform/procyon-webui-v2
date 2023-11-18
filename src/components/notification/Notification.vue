<template>
  <div class='content'>
    <div class='content-container'>
      <h2>{{ $t('MSG_NOTIFICATION_CENTER') }}</h2>
      <ul class='notification-center'>
        <li class='first'>
          <span>
            <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: utils.getLocaleString(unReads.length)})' />
            <span class='clear-all'>
              <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
            </span>
          </span>
        </li>
        <NotifCard class='cursor-pointer' v-for='row in notifications' :key='(row as notif.Notif).ID' :notif='row' />
      </ul>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { notif, utils, user } from 'src/npoolstore'
import { getNotifs, onMarkAll } from 'src/api/notif'

const NotifCard = defineAsyncComponent(() => import('src/components/notification/NotifCard.vue'))

const _notif = notif.useNotifStore()
const notifications = computed(() => _notif.notifs(undefined, logined.loginedUserID))
const logined = user.useLocalUserStore()
const unReads = computed(() => _notif.unreads(undefined, logined.loginedUserID))

onMounted(() => {
  if (notifications.value?.length === 0) {
    getNotifs(0, 100)
  }
})

</script>
<style lang='sass' scoped>
.content-container
  min-height: 410px
</style>
