<template>
  <div class='page column'>
    <MainHeader v-if='setting.ShowMainHeader' />
    <div :class='[ "main row", special ? "special" : "" ]'>
      <SideMenu />
      <div id='main'>
        <div :class='[ setting.ShowSideMenu ? "with-sidebar" : "" ]'>
          <router-view />
        </div>
      </div>
    </div>
    <q-space />
    <Footer v-if='setting.ShowFooterTop' :class='[ special ? "special" : "" ]' />
  </div>
  <LangLoader />
  <Prepare />
</template>

<script setup lang='ts'>
import { defineAsyncComponent, onMounted, computed, watch } from 'vue'
import { useSettingStore } from 'src/localstore'
import { useRouter } from 'vue-router'
import 'src/api/app'
import { _locale, notify, requesterror, user } from 'src/npoolstore'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const Prepare = defineAsyncComponent(() => import('src/components/prepare/Prepare.vue'))
const SideMenu = defineAsyncComponent(() => import('src/components/menu/SideMenu.vue'))

const locale = _locale.useLocaleStore()
const special = computed(() => locale.AppLang?.Lang === 'ja-JP')

const notification = notify.useNotificationStore()
const setting = useSettingStore()

const errorswitcher = requesterror.useErrorStore()
const trigger = computed(() => errorswitcher.ErrorTrigger)
const logined = user.useLocalUserStore()
const router = useRouter()

watch(trigger, () => {
  if (!trigger.value) {
    return
  }
  switch (trigger.value.Target) {
    case requesterror.SwitchTarget.LOGIN:
      logined.restUser()
      void router.push('/signin')
      errorswitcher.$reset()
  }
})

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        notify.notify(notif)
      }
    })
  })
})

</script>

<style lang='sass' scoped>
.main
  min-height: 400px
  width: 100%

.page
  min-height: 100vh
</style>
