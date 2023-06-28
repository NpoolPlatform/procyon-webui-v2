<template>
  <li :class='[row.Notified ? "" : "unread"]' @click='onMark([row])'>
    <span class='top'>
      <span class='date'>{{ formatTime(row?.CreatedAt, false, 'YYYY-MM-DD') }}</span>
      <span class='title'>{{ row.Title }}</span>
    </span>
    <span v-html='row.Content' />
  </li>
</template>
<script lang='ts' setup>
import { formatTime, Notif, NotifyType, useFrontendNotifStore } from 'npool-cli-v4'
import { defineProps, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  notif: Notif;
}

const props = defineProps<Props>()
const row = toRef(props, 'notif')

const notif = useFrontendNotifStore()
const onMark = (rows: Array<Notif>) => {
  if (rows?.[0]?.Notified) {
    return
  }
  const reqs = []
  for (let i = 0; i < rows.length; i++) {
    reqs.push({ ID: rows[i].ID, Notified: true })
  }
  notif.updateNotifs({
    Infos: reqs,
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
