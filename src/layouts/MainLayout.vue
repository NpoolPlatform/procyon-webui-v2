<template>
  <MainHeader />
  <div class='main row'>
    <SideMenu />
    <div id='main'>
      <router-view />
    </div>
  </div>
  <Footer />
  <LangLoader />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted } from 'vue'
import { useNotificationStore, notify } from 'npool-cli-v2'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const SideMenu = defineAsyncComponent(() => import('src/components/menu/SideMenu.vue'))

const notification = useNotificationStore()

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        notify(notif)
      }
    })
  })
})

</script>

<style lang='sass' scoped>
.main
  min-height: 400px
</style>
