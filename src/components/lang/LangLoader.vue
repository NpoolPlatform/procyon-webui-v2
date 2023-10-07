<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { _locale, notify, applang, message, g11nbase, user } from 'src/npoolstore'
import { useSettingStore } from 'src/localstore'

const logined = user.useLocalUserStore()

const locale = _locale.useLocaleStore()
const langID = computed(() => locale.langID())

const _setting = useSettingStore()
const lang = applang.useAppLangStore()

const _message = message.useMessageStore()
const messages = computed(() => _message.messages(undefined, langID.value, undefined))
const userLangID = computed(() => logined.selectedLangID)
const targetLangID = computed(() => locale.langID() || userLangID.value || lang.mainLangID(undefined))

watch(userLangID, () => {
  if (!userLangID.value) {
    return
  }
  setLang(userLangID.value)
})

const setLang = (_langID: string) => {
  const _lang = lang.lang(undefined, _langID)
  if (!_lang) {
    return
  }
  setTimeout(() => {
    if (_setting.LangThrottling) {
      setLang(_langID)
      return
    }
    locale.setLang(_lang)
  }, 100)
}

watch(targetLangID, () => {
  if (!targetLangID.value) {
    return
  }
  setLang(targetLangID.value)
})

const _getMessages = () => {
  const concurrent = 10
  for (let i = 0; i < concurrent; i++) {
    _setting.LangThrottling = true
    getMessages(i * 100, 100, concurrent)
  }
}

watch(langID, () => {
  if (messages.value.length === 0) {
    _getMessages()
    return
  }
  _setting.LangThrottling = false
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
    if (error || !rows.length) {
      setLang(targetLangID.value as string)
      if (messages.value.length === 0) {
        _getMessages()
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getMessages = (offset: number, limit: number, concurrent: number) => {
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
      _setting.LangThrottling = false
      return
    }
    getMessages(offset + concurrent * limit, limit, concurrent)
  })
}

onMounted(() => {
  if (!lang.langs(undefined).length) {
    getAppLangs(0, 100)
  }
})

</script>
