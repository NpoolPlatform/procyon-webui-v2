<template>
  <ul class='language-picker'>
    <li
      v-for='language in langs'
      :class='[ curLang === language.Lang ? "selected" : "", throtting ? "disabled" : "" ]'
      :key='language.ID'
      @click='onLangClick(language)'
    >
      <a class='language'>
        {{ language.Short?.length > 0 ? language.Short : language.Lang }}
      </a>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { applang, _locale, user, notif, g11nbase } from 'src/npoolstore'
import { getNotifs } from 'src/api/notif'
import { computed } from 'vue'
import { useSettingStore } from 'src/localstore'

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(undefined))

const locale = _locale.useLocaleStore()
const curLang = computed(() => locale.lang())

const logined = user.useLocalUserStore()
const _user = user.useUserStore()

const _notif = notif.useNotifStore()
const _setting = useSettingStore()
const throtting = computed(() => _setting.LangThrottling)

const onLangClick = (language: g11nbase.AppLang) => {
  _setting.LangThrottling = true
  locale.setLang(language)
  if (logined.logined) {
    _notif.$reset()
    getNotifs(0, 100)
    _user.updateUser({
      SelectedLangID: language.LangID,
      Message: {}
    }, () => {
      // TODO
    })
  }
}

</script>

<style lang='sass' scoped>
.disabled
  pointer-events: none
  color: grey
</style>
