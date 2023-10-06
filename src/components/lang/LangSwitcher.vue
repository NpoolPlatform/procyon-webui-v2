<template>
  <ul class='language-picker'>
    <div v-if='langs.length > 1'>
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
    </div>
  </ul>
</template>

<script setup lang='ts'>
import { applang, _locale, user, g11nbase } from 'src/npoolstore'
import { computed } from 'vue'
import { useSettingStore } from 'src/localstore'

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(undefined))

const locale = _locale.useLocaleStore()
const curLang = computed(() => locale.lang())

const logined = user.useLocalUserStore()
const _user = user.useUserStore()

const _setting = useSettingStore()
const throtting = computed(() => _setting.LangThrottling)

const onLangClick = (language: g11nbase.AppLang) => {
  if (language.LangID === locale.langID()) {
    return
  }
  if (throtting.value) {
    return
  }
  _setting.LangThrottling = true
  locale.setLang(language)
  if (logined.logined) {
    _user.updateUser({
      SelectedLangID: language.LangID,
      Message: {}
    }, () => {
      // TODO
    })
  }
}
</script>
