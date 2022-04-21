<template>
  <ul class='language-picker'>
    <li
      v-for='language in locale.Languages'
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

import { Language, useLangStore, useLocaleStore } from 'npool-cli-v2'
import { computed } from 'vue'

const lang = useLangStore()
const locale = useLocaleStore()
const curLang = computed(() => locale.CurLang?.Lang)

const onLangClick = (language: Language) => {
  lang.setLang(language)
}

</script>
