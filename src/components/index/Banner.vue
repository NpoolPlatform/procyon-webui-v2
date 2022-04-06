<template>
  <div class='banner background-main'>
    <Announcement />
    <MainHeader class='header' />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Announcement = defineAsyncComponent(() => import('src/components/announcement/Announcement.vue'))

</script>

<style lang='sass' scoped>
.banner
  background-repeat: no-repeat
  background-size: 100% 660px
  min-height: 660px
  width: 100%

.header
  margin-top: 20px
</style>
