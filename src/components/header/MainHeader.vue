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
        <div class='header-search'>
          <q-input
            ref='headerSearch'
            rounded
            dense
            standout
            outlined
            v-model='text'
            @click='onSearchClick'
            class='header-input'
            placeholder='Search'
            @keyup.ctrl.q='onSearchClick'
          >
            <template #prepend>
              <q-icon name='search' />
            </template>
          </q-input>
        </div>

        <!-- <div><q-icon name='search' size='2rem' style='margin-top: 4px' @click='onSearchClick' /></div> -->
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
  <!-- Search Dialog -->
  <q-dialog v-model='showSearchDialog'>
    <q-card>
      <Card />
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, watch, onMounted, ref } from 'vue'
import { HeaderAvatarMenu, MenuItem } from 'src/menus/menus'
import { useRouter } from 'vue-router'
import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'
import userAvatar from '../../assets/icon-user.svg'
import {
  NotifyType,
  useFrontendUserStore,
  useLocalUserStore,
  useFrontendNotifStore,
  useLocaleStore,
  useFrontendAppStore
} from 'npool-cli-v4'
import { getNotifs, onMarkAll } from 'src/api/notif'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const Card = defineAsyncComponent(() => import('src/components/header/Card.vue'))
const ExpandList = defineAsyncComponent(() => import('src/components/list/ExpandList.vue'))
const NotifCard = defineAsyncComponent(() => import('src/components/notification/NotifCard.vue'))
// const SearchCard = defineAsyncComponent(() => import('src/pages/faq/Search.vue'))

const locale = useLocaleStore()
const special = computed(() => locale.AppLang?.Lang === 'ja-JP')

const user = useFrontendUserStore()
const localUser = useLocalUserStore()

const router = useRouter()

const onSwitchMenu = (item: MenuItem) => {
  if (item.label === 'MSG_LOGOUT') {
    user.logout({
      Token: localUser.User.LoginToken,
      Message: {
        Error: {
          Title: t('MSG_LOGOUT_FAIL'),
          Popup: true,
          Type: NotifyType.Error
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

watch(logined, () => {
  if (!logined.value) {
    return
  }
  setTimeout(() => {
    initialize()
  }, 2000)
})

const initialize = () => {
  if (localUser.User?.InvitationCode?.length) {
    // TODO
  }
}

const notif = useFrontendNotifStore()
const unReads = computed(() => notif.unReads)
const lastFiveNotifs = computed(() => notif.notifs?.length >= 5 ? notif.notifs?.slice(0, 5) : notif.notifs)

onMounted(() => {
  if (logined.value) {
    setTimeout(() => {
      initialize()
    }, 2000)
  }

  if (logined.value) {
    setInterval(() => {
      if (!logined.value) {
        return
      }
      notif.$reset()
      getNotifs(0, 500)
    }, 120000)
  }
})

onMounted(() => {
  if (localUser.logined && notif.Notifs.Notifs.length === 0) {
    getNotifs(0, 500)
  }
})

const app = useFrontendAppStore()
watch(() => app.App?.Maintaining, () => {
  if (app.App?.Maintaining) {
    void router.push({ path: '/maintenance' })
  }
})

onMounted(() => {
  if (app.App?.Maintaining) {
    void router.push({ path: '/maintenance' })
  }
})
const headerSearch = ref<HTMLInputElement>()
const text = ref('')
const showSearchDialog = ref(false)
const onSearchClick = () => {
  headerSearch.value?.blur()
  showSearchDialog.value = true
}
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

.header-search
  width: 150px
  ::v-deep .q-field__control
    background: white
  ::v-deep input
    background: none
    box-shadow: none
    margin: 0
    outline: none
</style>
