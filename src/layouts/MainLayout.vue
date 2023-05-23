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
import {
  useNotificationStore as useOldNotificationStore,
  notify as OldNotify,
  useErrorSwitcherStore as useOldErrorSwitcherStore,
  SwitchTarget as OldSwitchTarget,
  ErrorTarget as OldErrorTarget
} from 'npool-cli-v2'

import {
  notify,
  useErrorStore,
  useLocalUserStore,
  useNotificationStore,
  User,
  SwitchTarget,
  ErrorTarget,
  useLocaleStore,
  useAdminAppLangStore
} from 'npool-cli-v4'
import { useSettingStore } from 'src/localstore'
import { useRouter } from 'vue-router'

const MainHeader = defineAsyncComponent(() => import('src/components/header/MainHeader.vue'))
const Footer = defineAsyncComponent(() => import('src/components/footer/Footer.vue'))
const LangLoader = defineAsyncComponent(() => import('src/components/lang/LangLoader.vue'))
const Prepare = defineAsyncComponent(() => import('src/components/prepare/Prepare.vue'))
const SideMenu = defineAsyncComponent(() => import('src/components/menu/SideMenu.vue'))

const locale = useLocaleStore()
const special = computed(() => locale.AppLang?.Lang === 'ja-JP')

const notification = useOldNotificationStore()
const notificationV4 = useNotificationStore()
const setting = useSettingStore()

const errorswitcher = useOldErrorSwitcherStore()
const trigger = computed(() => errorswitcher.ErrorTrigger)

const logined = useLocalUserStore()

const user = useLocalUserStore()
const lang = useAdminAppLangStore()

watch(() => user.User?.SelectedLangID, () => {
  if (user.User && user.User.SelectedLangID?.length > 0) {
    const _lang = lang.AppLangs.AppLangs.find((el) => el.LangID === user.User?.SelectedLangID)
    if (!_lang) {
      console.log('LangID Not Found', user.User?.SelectedLangID)
      return
    }
    locale.setLang(_lang)
  }
})

const router = useRouter()

watch(trigger, () => {
  if (!trigger.value) {
    return
  }
  switch (trigger.value.Target) {
    case OldSwitchTarget.LOGIN:
      void router.push('/signin')
      errorswitcher.ErrorTrigger = undefined as unknown as OldErrorTarget
      logined.User = undefined as unknown as User
  }
})

const errorswitcherV4 = useErrorStore()
const triggerV4 = computed(() => errorswitcherV4.ErrorTrigger)

watch(triggerV4, () => {
  if (!triggerV4.value) {
    return
  }
  switch (triggerV4.value.Target) {
    case SwitchTarget.LOGIN:
      void router.push('/signin')
      errorswitcherV4.ErrorTrigger = undefined as unknown as ErrorTarget
      logined.User = undefined as unknown as User
  }
})

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        OldNotify(notif)
      }
    })
  })
  notificationV4.$subscribe((_, state) => {
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
  width: 100%

.page
  min-height: 100vh
</style>
