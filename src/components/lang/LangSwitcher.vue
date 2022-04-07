<template>
  <ul class='language-picker'>
    <li
      class='selected'
      v-for='language in lang.Languages'
      :key='language.ID'
      @click='onLangClick(language)'
    >
      <a class='language'>
        {{ language.Short.length > 0 ? language.Short : language.Lang }}
      </a>
    </li>
  </ul>
</template>

<script setup lang='ts'>

import { useLangStore, Language } from 'npool-cli-v2'

const lang = useLangStore()
const onLangClick = (language: Language) => {
  lang.setLang(language)
}

</script>
