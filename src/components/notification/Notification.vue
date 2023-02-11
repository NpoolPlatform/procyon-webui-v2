<template>
  <div class='content'>
    <h2>{{ $t('MSG_NOTIFICATIONS') }}</h2>
    <ul class='notification-center'>
      <li v-for='row in notifications' :key='row.ID'>
        <span class='top'>
          <span class='date'>{{ date.formatDate(row?.CreatedAt * 1000, 'YYYY-MM-DD') }}</span>
          <span class='title'>{{ row.EventType }}</span>
        </span>
        <span v-html='row.Content' />
      </li>
    </ul>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted } from 'vue'
import { date } from 'quasar'
import { useI18n } from 'vue-i18n'
import { NotifyType, useFrontendNotifStore, Notif } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const notif = useFrontendNotifStore()
const notifications = computed(() => notif.notifs)

onMounted(() => {
  if (notifications.value?.length === 0) {
    getNotifs(0, 500)
  }

  if (notif.unReads?.length > 0) {
    onMarkAll(notif.unReads)
  }
})

const onMarkAll = (rows: Array<Notif>) => {
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

const getNotifs = (offset: number, limit: number) => {
  notif.getNotifs({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<Notif>) => {
    if (error || rows.length < limit) {
      if (notif.unReads?.length > 0) {
        onMarkAll(notif.unReads)
      }
      return
    }
    getNotifs(offset + limit, limit)
  })
}
</script>
