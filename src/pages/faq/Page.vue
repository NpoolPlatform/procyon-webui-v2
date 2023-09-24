<template>
  <div class='up-button content-glass'>
    <a @click='scrollTo("main")'><img src='font-awesome/up-arrow.svg'></a>
  </div>
  <div class='content faq'>
    <div id='hero'>
      <h1>{{ $t('MSG_SUPPORT_CENTER') }}</h1>
      <div id='search-box'>
        <form action='javascript: void(0)'>
          <input id='search-field' type='text' @click='onSearchClick'>
          <input id='search-button' type='submit' value='Search'>
        </form>
      </div>
    </div>

    <slot name='body' />
  </div>
  <Search v-model:visible='showing' />
</template>

<script setup lang='ts'>
import { scrollTo } from 'src/utils/scroll'
import { defineAsyncComponent, ref } from 'vue'

const Search = defineAsyncComponent(() => import('src/components/help/Search.vue'))

const showing = ref(false)
const onSearchClick = () => {
  showing.value = true
}
</script>
