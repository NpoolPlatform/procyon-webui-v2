<template>
  <ul class='language-picker'>
    <li
      class='selected'
      v-for='language in locale.Languages'
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

const locale = useLocaleStore()
const lang = useLangStore()

const onLangClick = (language: Language) => {
  console.log(language)
  lang.setLang(language)
}

</script>
