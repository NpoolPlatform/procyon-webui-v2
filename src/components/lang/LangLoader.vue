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
    getMessages(0, 100, langID.value)
    return
  }
  _setting.LangThrottling = false
})

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(undefined))
const _setting = useSettingStore()
const logined = user.useLocalUserStore()
const userLangID = computed(() => logined.selectedLangID)

const setLang = (__lang: g11nbase.AppLang) => {
  setTimeout(() => {
    if (_setting.LangThrottling) {
      setLang(__lang)
    }
    locale.setLang(__lang)
  }, 1000)
}

watch(userLangID, () => {
  if (userLangID.value) {
    const _lang = lang.lang(undefined, userLangID.value)
    if (_lang) {
      setLang(_lang)
    }
  }
})

const getLangByName = computed(() => (name: string) => {
  const appLang = lang.lang(undefined, undefined, name)
  return appLang
})

const router = useRouter()
const setLocale = computed(() => (path: string) => {
  const name = path.split('/')?.[1]
  if (name?.length < 2) return
  const _lang = getLangByName.value(name)
  if (_lang) {
    setLang(_lang)
  }
})

watch(() => router.currentRoute.value.path, (newValue) => {
  setLocale.value(newValue)
}, { immediate: true })

watch(langs, () => {
  setLocale.value(router.currentRoute.value.path)
}, { immediate: true })

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
  }, (error: boolean, rows?: Array<g11nbase.Message>) => {
    if (error || !rows?.length) {
      _setting.LangThrottling = false
      return
    }
    getMessages(offset + limit, limit, langID)
  })
}
</script>
