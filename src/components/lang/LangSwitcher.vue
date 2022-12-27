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

import { useLocalLangStore } from 'src/localstore/lang'
import { useAdminAppLangStore } from 'src/teststore/mock/g11n/applang'
import { AppLang } from 'src/teststore/mock/g11n/applang/types'
import { computed } from 'vue'

const lang = useAdminAppLangStore()
const langs = computed(() => lang.AppLangs.AppLangs)

const locale = useLocalLangStore()
const curLang = computed(() => locale.AppLang?.Lang)

const onLangClick = (language: AppLang) => {
  locale.setLang(language)
}

</script>
