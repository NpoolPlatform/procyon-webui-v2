<template>
  <div class='content'>
    <h2>{{ $t('MSG_NOTIFICATIONS') }}</h2>
    <ul class='notification-center'>
      <li v-for='row in notifications' :key='row.ID' @click='onMark([row])'>
        <span class='top'>
          <span class='date'>{{ formatTime(row?.CreatedAt, true) }}</span>
          <span class='title'>{{ row.EventType }}</span>
        </span>
        <span v-html='row.Content' />
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { useFrontendNotifStore } from 'src/teststore/mock/notify'
import { computed, onMounted } from 'vue'
import { formatTime } from 'npool-cli-v4/utils'
import { getNotifs } from 'src/api/notif'
import { Notif } from 'src/teststore/mock/notify/const'
import { useI18n } from 'vue-i18n'
import { NotifyType } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const notif = useFrontendNotifStore()
const notifications = computed(() => notif.Notifs.Notifs)

onMounted(() => {
  if (notifications.value?.length === 0) {
    getNotifs(0, 500)
  }
})

const onMark = (rows: Array<Notif>) => {
  if (rows?.[0].AlreadyRead) {
    return
  }
  const ids = Array.from(rows).map((el) => el.ID)
  notif.updateNotifs({
    IDs: ids,
    AlreadyRead: true,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_NOTIFICATION'),
        Message: t('MSG_UPDATE_NOTIFICATION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
