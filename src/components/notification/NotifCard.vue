<template>
  <li :class='[row.Notified ? "" : "unread"]' @click='onMark([row])'>
    <span class='top'>
      <span class='date'>{{ utils.formatTime(row?.CreatedAt, 'YYYY-MM-DD') }}</span>
      <span class='title'>{{ row.Title }}</span>
    </span>
    <span v-html='row.Content' />
  </li>
</template>
<script lang='ts' setup>
import { utils, notif, notify } from 'src/npoolstore'
import { defineProps, toRef } from 'vue'

interface Props {
  notif: notif.Notif
}

const props = defineProps<Props>()
const row = toRef(props, 'notif')

const _notif = notif.useNotifStore()
const onMark = (rows: Array<notif.Notif>) => {
  if (rows?.[0]?.Notified) {
    return
  }
  const reqs = []
  for (let i = 0; i < rows.length; i++) {
    reqs.push({ ID: rows[i].ID, Notified: true, EntID: rows[i].EntID })
  }
  _notif.updateNotifs({
    Infos: reqs,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_NOTIFICATION',
        Message: 'MSG_UPDATE_NOTIFICATION_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
