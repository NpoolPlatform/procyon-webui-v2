<template>
  <header class='desktop1' :class='[ special ? "special" : "" ]'>
    <img :src='lightLogo' class='attachment-large size-large logo cursor-pointer' @click='onLogoClick'>
    <div class='nav'>
      <ul>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/" })'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' target='_blank' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/", hash: "#support" })'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/", hash: "#partners" })'>{{ $t('MSG_PARTNERS') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/contact" })'>{{ $t('MSG_CONTACT') }}</a></li>
        <LangSwitcher />
        <li id='notifications' v-if='localUser.logined'>
          <img class='notification-icon notification-icon-inactive' src='font-awesome/bell.svg'>
          <span v-if='unReads?.length > 0' class='notification-dot'>{{ unReads?.length }}</span>
          <ul class='notifications' :style='{maxHeight: "700px", overflow: "scroll"}'>
            <li class='first'>
              <span>
                <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: unReads.length})' />
                <span class='clear-all'>
                  <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
                </span>
              </span>
              <span><a target='_blank' @click='router.push({ path: "/notification" })'>{{ $t('MSG_NOTIFICATION_CENTER') }} &roarr;</a></span>
            </li>
            <div :style='{overflow: "hidden"}' class='cursor-pointer'>
              <NotifCard v-for='row in lastFiveNotifs' :key='row.ID' :notif='row' />
            </div>
          </ul>
        </li>
        <SignHelper v-if='!localUser.logined' />
        <q-btn
          v-else
          size='1.1rem'
          flat dense round rounded
          :icon='"img:" + userAvatar'
          class='user-icon icon-logined'
        >
          <q-menu
            self='top right'
            anchor='bottom right'
            transition-show='jump-down'
            transition-hide='jump-up'
          >
            <q-list class='dropdown'>
              <ExpandList
                :menu='menu'
                :show-icon='true'
                :show-icon-right='true'
                :show-label='false'
                :handle-router='false'
                :margin='true'
                @switch-menu='onSwitchMenu'
              />
            </q-list>
          </q-menu>
        </q-btn>
      </ul>
    </div>
  </header>

  <header class='mobile' :class='[ special ? "special" : "" ]'>
    <img :src='logo' class='attachment-large size-large logo'>

    <div class='header-inner'>
      <LangSwitcher />
      <li id='notifications' v-if='localUser.logined' @click='onBellClick'>
        <img class='notification-icon notification-icon-inactive' src='font-awesome/bell.svg'>
        <span v-if='unReads?.length > 0' class='notification-dot'>{{ unReads?.length }}</span>
        <ul class='notifications' :style='{maxHeight: "700px", overflow: "scroll"}'>
          <li class='first'>
            <span>
              <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: unReads.length})' />
              <span class='clear-all'>
                <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
              </span>
            </span>
            <span><a target='_blank' @click='router.push({ path: "/notification" })'>{{ $t('MSG_NOTIFICATION_CENTER') }} &roarr;</a></span>
          </li>
          <div :style='{overflow: "hidden"}' class='cursor-pointer'>
            <NotifCard v-for='row in lastFiveNotifs' :key='row.ID' :notif='row' />
          </div>
        </ul>
      </li>
      <SignHelper v-if='!localUser.logined' />
      <q-btn
        v-else
        size='1.1rem'
        flat dense round rounded
        :icon='"img:" + userAvatar'
        class='user-icon icon-logined'
      >
        <q-menu
          self='top right'
          anchor='bottom right'
          transition-show='jump-down'
          transition-hide='jump-up'
        >
          <q-list class='dropdown'>
            <ExpandList
              :menu='menu'
              :show-icon='true'
              :show-icon-right='true'
              :show-label='false'
              :handle-router='false'
              :margin='true'
              @switch-menu='onSwitchMenu'
            />
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <div class='hr' />
    <div class='nav'>
      <ul>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/" })'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' target='_blank' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/", hash: "#support" })'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/contact" })'>{{ $t('MSG_CONTACT') }}</a></li>
        <li><a class='nav-link' target='_blank' @click='router.push({ path: "/", hash: "#partners" })'>{{ $t('MSG_PARTNERS') }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, watch, onMounted, ref } from 'vue'
import { HeaderAvatarMenu, MenuItem } from 'src/menus/menus'
import { useRouter } from 'vue-router'
import { getNotifs, onMarkAll } from 'src/api/notif'
import { notify, user, notif, _locale, localapp, applang } from 'src/npoolstore'

import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'
import userAvatar from '../../assets/icon-user.svg'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const ExpandList = defineAsyncComponent(() => import('src/components/list/ExpandList.vue'))
const NotifCard = defineAsyncComponent(() => import('src/components/notification/NotifCard.vue'))

const special = computed(() => locale.lang() === 'ja-JP')

const _user = user.useUserStore()
const localUser = user.useLocalUserStore()

const router = useRouter()

const onSwitchMenu = (item: MenuItem) => {
  if (item.label === 'MSG_LOGOUT') {
    _user.logout({
      Token: localUser.User.LoginToken,
      Message: {
        Error: {
          Title: 'MSG_LOGOUT_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
    void router.push({ path: '/' })
    return
  }

  void router.push({
    path: item.target,
    query: {
      menuId: item.menuId
    }
  })
}

const menu = computed(() => {
  const myMenu = HeaderAvatarMenu()
  myMenu.children = myMenu.children.filter((m) => m.label !== 'MSG_REFERRAL' || localUser.isKol)
  return myMenu
})

const onLogoClick = () => {
  void router.push({ path: '/' })
}

const onBellClick = () => {
  void router.push({ path: '/notification' })
}

const logined = computed(() => localUser.logined)
const notifFetcher = ref(-1)

watch(logined, () => {
  if (notifFetcher.value >= 0) {
    if (!logined.value) {
      window.clearInterval(notifFetcher.value)
      notifFetcher.value = -1
    }
    return
  }
  if (!logined.value) {
    return
  }
  getNotifs(0, 100)
  notifFetcher.value = window.setInterval(() => {
    _notif.$reset()
    getNotifs(0, 100)
  }, 120000)
})

const _notif = notif.useNotifStore()
const unReads = computed(() => _notif.unreads(undefined, localUser.loginedUserID))
const notifs = computed(() => _notif.notifs(undefined, localUser.loginedUserID))
const lastFiveNotifs = computed(() => notifs.value.length > 5 ? notifs.value.slice(0, 5) : notifs.value)

onMounted(() => {
  if (logined.value) {
    getNotifs(0, 100)
    notifFetcher.value = window.setInterval(() => {
      _notif.$reset()
      getNotifs(0, 100)
    }, 120000)
  }
})

const app = localapp.useLocalApplicationStore()
const maintaining = computed(() => app.maintaining())

watch(maintaining, () => {
  if (maintaining.value) {
    void router.push({ path: '/maintenance' })
  }
})

onMounted(() => {
  if (maintaining.value) {
    void router.push({ path: '/maintenance' })
  }
})

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(undefined))
const getLangByName = computed(() => (name: string) => {
  const appLang = lang.lang(undefined, undefined, name)
  return appLang
})

const locale = _locale.useLocaleStore()
const setLocale = computed(() => (path: string) => {
  const name = path.split('/')?.[1]
  if (name?.length < 2) return
  const lang = getLangByName.value(name)
  if (!lang) return
  locale.setLang(lang)
})

watch(() => router.currentRoute.value.path, (newValue) => {
  setLocale.value(newValue)
}, { immediate: true })

watch(langs, () => {
  setLocale.value(router.currentRoute.value.path)
}, { immediate: true })

</script>

<style lang='sass' scoped>
.dropdown
  min-width: 200px

li#notifications::marker
  content: ''

.desktop1,.mobile > .nav
  ::v-deep .q-hoverable:hover > .q-focus-helper
    background: none
  ::v-deep .q-focus-helper:before
    background: none
  ::v-deep .q-focus-helper:after
    background: none
.icon-logined
  margin-left: 0
.mobile
  ::v-deep .user-icon:hover
    filter: none

.notifications::-webkit-scrollbar
  display: none

</style>
