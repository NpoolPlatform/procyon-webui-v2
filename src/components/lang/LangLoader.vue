<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalLangStore } from 'src/localstore/lang'
import { useAdminAppLangStore } from 'src/teststore/mock/g11n/applang'
import { AppLang } from 'src/teststore/mock/g11n/applang/types'
import { NotifyType } from 'npool-cli-v4'
import { useFrontendMessageStore } from 'src/teststore/mock/g11n/message'
import { Message } from 'src/teststore/mock/g11n/message/types'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const locale = useLocalLangStore()
const langID = computed(() => locale.AppLang?.LangID)

const message = useFrontendMessageStore()
const messages = computed(() => message.getMessagesByLangID(langID.value))
watch(langID, () => {
  if (messages.value.length === 0) {
    getMessages(0, 500)
  }
})

const lang = useAdminAppLangStore()

onMounted(() => {
  if (lang.AppLangs.AppLangs.length === 0) {
    getAppLangs(0, 100)
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
