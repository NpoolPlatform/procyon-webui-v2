<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore, useAdminAppLangStore, AppLang, NotifyType, useFrontendMessageStore, Message, useLocalUserStore } from 'npool-cli-v4'
import { useFrontendNotifStore } from 'src/teststore/mock/notify'
import { getNotifs } from 'src/api/notif'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const locale = useLocaleStore()
const langID = computed(() => locale.AppLang?.LangID)

const message = useFrontendMessageStore()
const messages = computed(() => message.getMessagesByLangID(langID.value))
watch(langID, () => {
  if (messages.value.length === 0) {
    getMessages(0, 500)
  }
})

const lang = useAdminAppLangStore()

const logined = useLocalUserStore()

const notif = useFrontendNotifStore()

onMounted(() => {
  if (lang.AppLangs.AppLangs.length === 0) {
    getAppLangs(0, 100)
  }
  if (logined.logined && notif.Notifs.Notifs.length === 0) {
    getNotifs(0, 500)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_LANG_MESSAGES'),
        Message: t('MSG_GET_LANG_MESSAGES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppLang>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getMessages = (offset: number, limit: number) => {
  message.getMessages({
    LangID: langID.value,
    Disabled: false,
    Offset: offset,
    Limit: limit,
    NotifyMessage: {
      Error: {
        Title: t('MSG_GET_LANG_MESSAGES'),
        Message: t('MSG_GET_LANG_MESSAGES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Message>) => {
    if (error || rows.length === 0) {
      return
    }
    getMessages(offset + limit, limit)
  })
}
</script>
