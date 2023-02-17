<template>
  <header class='desktop1'>
    <img :src='lightLogo' class='attachment-large size-large logo cursor-pointer' @click='onLogoClick'>
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' target='_blank' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faqs'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#partners'>{{ $t('MSG_PARTNERS') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
        <LangSwitcher />
        <li id='notifications' v-if='localUser.logined'>
          <img class='notification-icon notification-icon-inactive' src='font-awesome/bell.svg'>
          <span v-if='unReads?.length > 0' class='notification-dot'>{{ unReads?.length }}</span>
          <ul class='notifications'>
            <li class='first'>
              <span>
                <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: unReads.length})' />
                <span class='clear-all'>
                  <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
                </span>
              </span>
              <span><a href='#/notification'>{{ $t('MSG_NOTIFICATION_CENTER') }} &roarr;</a></span>
            </li>
            <NotifCard v-for='row in unReads' :key='row.ID' :notif='row' />
          </ul>
        </li>
        <SignHelper v-if='!localUser.logined' />
        <q-btn
          v-else
          size='1.1rem'
          flat dense round rounded
          :icon='"img:" + userAvatar'
          class='user-icon'
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

  <header class='mobile'>
    <img :src='logo' class='attachment-large size-large logo'>

    <div class='header-inner'>
      <LangSwitcher />
      <li id='notifications' v-if='localUser.logined'>
        <img class='notification-icon notification-icon-inactive' src='font-awesome/bell.svg'>
        <span v-if='unReads?.length > 0' class='notification-dot'>{{ unReads?.length }}</span>
        <ul class='notifications'>
          <li class='first'>
            <span>
              <span v-html='$t("MSG_NEW_NOTIFICATIONS",{TOTAL: unReads.length})' />
              <span class='clear-all'>
                <a @click='onMarkAll(unReads)'>{{ $t('MSG_MARK_ALL_AS_READ') }}</a>
              </span>
            </span>
            <span><a href='#/notification'>{{ $t('MSG_NOTIFICATION_CENTER') }} &roarr;</a></span>
          </li>
          <NotifCard v-for='row in unReads' :key='row.ID' :notif='row' />
        </ul>
      </li>
      <SignHelper v-if='!localUser.logined' />
      <q-btn
        v-else
        size='1.1rem'
        flat dense round rounded
        :icon='"img:" + userAvatar'
        class='user-icon'
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
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' target='_blank' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faqs'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
        <li><a class='nav-link' href='#partners'>{{ $t('MSG_PARTNERS') }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed, watch, onMounted } from 'vue'
import { HeaderAvatarMenu, MenuItem } from 'src/menus/menus'
import { useRouter } from 'vue-router'
import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'
import userAvatar from '../../assets/icon-user.svg'
import {
  NotifyType,
  useFrontendUserStore,
  useLocalUserStore,
  useFrontendNotifStore
} from 'npool-cli-v4'
import { getNotifs, onMarkAll } from 'src/api/notif'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const ExpandList = defineAsyncComponent(() => import('src/components/list/ExpandList.vue'))
const NotifCard = defineAsyncComponent(() => import('src/components/notification/NotifCard.vue'))

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

onMounted(() => {
  if (logined.value) {
    setTimeout(() => {
      initialize()
    }, 2000)
  }

  if (logined.value) {
    setInterval(() => {
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

</script>

<style lang='sass' scoped>
.dropdown
  min-width: 200px
</style>
