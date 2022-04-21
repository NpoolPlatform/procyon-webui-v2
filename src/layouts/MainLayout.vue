<template>
  <div class='page column'>
    <MainHeader :class='[ special ? "special" : "" ]' />
    <div :class='[ "main row", special ? "special" : "" ]'>
      <SideMenu />
      <div id='main'>
        <div :class='[ setting.ShowSideMenu ? "with-sidebar" : "" ]'>
          <router-view />
        </div>
      </div>
    </div>
    <q-space />
    <Footer :class='[ special ? "special" : "" ]' />
  </div>
  <LangLoader />
  <Prepare />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { useNotificationStore, notify, useLocaleStore } from 'npool-cli-v2'
import { useSettingStore } from 'src/localstore'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const Prepare = defineAsyncComponent(() => import('src/components/prepare/Prepare.vue'))
const SideMenu = defineAsyncComponent(() => import('src/components/menu/SideMenu.vue'))

const locale = useLocaleStore()
const special = computed(() => locale.CurLang?.Lang === 'ja-JP')

const notification = useNotificationStore()
const setting = useSettingStore()

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

.special
  font-family: 'Noto Sans JP'

.page
  min-height: 100vh
</style>
