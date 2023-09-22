<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { _locale, notify, applang, message, g11nbase } from 'src/npoolstore'

const locale = _locale.useLocaleStore()
const langID = computed(() => locale.langID())

const _message = message.useMessageStore()
const messages = computed(() => _message.messages(undefined, langID.value, undefined))
watch(langID, () => {
  console.log(langID.value, messages.value.length)
  if (messages.value.length === 0) {
    getMessages(0, 100, langID.value)
  }
})

const lang = applang.useAppLangStore()

onMounted(() => {
  if (!lang.langs(undefined).length) {
    getAppLangs(0, 100)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LANG_MESSAGES',
        Message: 'MSG_GET_LANG_MESSAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<g11nbase.AppLang>) => {
    if (error || rows.length < limit) {
      getMessages(0, 100, langID.value)
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getMessages = (offset: number, limit: number, langID: string) => {
  _message.getMessages({
    Disabled: false,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LANG_MESSAGES',
        Message: 'MSG_GET_LANG_MESSAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<g11nbase.Message>) => {
    if (error || !rows?.length) {
      return
    }
    getMessages(offset + limit, limit, langID)
  })
}
</script>
