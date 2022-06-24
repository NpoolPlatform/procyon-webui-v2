<template>
  <div class='up-button content-glass'>
    <a @click='scrollTo("main")'><img src='font-awesome/up-arrow.svg'></a>
  </div>
  <div class='content faq'>
    <div id='hero'>
      <h1>Support Center</h1>
      <div v-show='false' id='search-box'>
        <form>
          <input id='search-field' type='text'>
          <input id='search-button' type='submit' value='Search'>
        </form>
      </div>
    </div>

    <slot name='body' />
  </div>
</template>

<script setup lang='ts'>
import { scrollTo } from 'src/utils/scroll'
</script>
