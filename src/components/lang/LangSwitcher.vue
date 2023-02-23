<template>
  <ul class='language-picker'>
    <li
      v-for='language in langs'
      :class='[ curLang === language.Lang ? "selected" : "" ]'
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

import { useLocaleStore, useAdminAppLangStore, AppLang, useFrontendNotifStore, useLocalUserStore } from 'npool-cli-v4'
import { getNotifs } from 'src/api/notif'
import { computed } from 'vue'

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const locale = useLocaleStore()
const curLang = computed(() => locale.AppLang?.Lang)

const logined = useLocalUserStore()

const notif = useFrontendNotifStore()

const onLangClick = (language: AppLang) => {
  locale.setLang(language)
  if (logined.logined) {
    notif.$reset()
    getNotifs(0, 500)
  }
}

</script>
