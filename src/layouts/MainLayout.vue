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
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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
      void router.push('/signin')
      errorswitcher.$reset()
      logined.$reset()
  }
})

onMounted(() => {
  notification.$subscribe((_, state) => {
    state.Notifications.forEach((notif, index) => {
      if (notif.Popup) {
        state.Notifications.splice(index, 1)
        if (notif.Description) {
          notif.Description = t(notif.Description)
        }
        if (notif.Message) {
          notif.Message = t(notif.Message)
        }
        if (notif.Title) {
          notif.Title = t(notif.Title)
        }
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
