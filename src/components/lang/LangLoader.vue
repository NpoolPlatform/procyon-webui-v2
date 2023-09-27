<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { _locale, notify, applang, message, g11nbase, user } from 'src/npoolstore'
import { useSettingStore } from 'src/localstore'
import { useRouter } from 'vue-router'

const locale = _locale.useLocaleStore()
const langID = computed(() => locale.langID())

const _message = message.useMessageStore()
const messages = computed(() => _message.messages(undefined, langID.value, undefined))
watch(langID, () => {
  if (messages.value.length === 0) {
    getMessages(0, 100)
    return
  }
  _setting.LangThrottling = false
})

const lang = applang.useAppLangStore()
const router = useRouter()
const _setting = useSettingStore()
const logined = user.useLocalUserStore()
const langName = computed(() => router.currentRoute.value.path.split('/')?.[1])
const targetLangID = computed(() => lang.langID(undefined, langName.value) || logined.selectedLangID || lang.mainLangID(undefined))

const setLang = () => {
  const _lang = lang.lang(undefined, targetLangID.value)
  if (!_lang) {
    return
  }
  setTimeout(() => {
    if (_setting.LangThrottling) {
      setLang()
      return
    }
    locale.setLang(_lang)
  }, 1000)
}

watch(targetLangID, () => {
  setLang()
})

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
      setLang()
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const getMessages = (offset: number, limit: number) => {
  _setting.LangThrottling = true
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
  }, (error: boolean, rows?: Array<g11nbase.Message>, total?: number) => {
    if (error || !rows?.length) {
      _setting.LangThrottling = false
      return
    }
    const arrays = new Array(Math.floor(total as number / 100)).fill(1).map((v, i) => ++i)
    arrays.forEach((index) => {
      batchGetMessages(index * 100, 100)
    })
  })
}

const batchGetMessages = (offset: number, limit: number) => {
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
  }, () => {
    _setting.LangThrottling = false
  })
}
</script>
