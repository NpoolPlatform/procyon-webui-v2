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
          <span class='notification-dot'>17</span>
          <ul class='notifications'>
            <li class='first'>
              <span><span class='number'>17</span> new notifications<span class='clear-all'><a href=''>Mark all as read</a></span></span>
              <span><a href=''>Notification center >></a></span>
            </li>
            <li>
              <span class='top'><span class='date'>2023-01-10</span><span class='title'>Withdrawal Completed</span></span>
              You have withdrawn 1000 USDT. See your <a href=''>Wallet</a> for details.
            </li>
            <li>
              <span class='top'><span class='date'>2023-01-09</span><span class='title'>KYC Approved</span></span>
              Your KYC has been approved! See your verified documents on the <a href=''>Personal Info</a> page.
            </li>
            <li>
              <span class='top'><span class='date'>2023-01-07</span><span class='title'>Deposit Completed</span></span>
              You have received 5500 USDT. See your <a href=''>Wallet</a> for details.
            </li>
            <li>
              <span class='top'><span class='date'>2023-01-05</span><span class='title'>Withdrawal Completed</span></span>
              You have withdrawn 1000 USDT. See your <a href=''>Wallet</a> for details.
            </li>
            <li>
              <span class='top'><span class='date'>2023-01-01</span><span class='title'>KYC Approved</span></span>
              Your KYC has been approved! See your verified documents on the <a href=''>Personal Info</a> page.
            </li>
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
import { useI18n } from 'vue-i18n'

import userAvatar from '../../assets/icon-user.svg'
import {
  NotifyType,
  useFrontendUserStore,
  useLocalUserStore
} from 'npool-cli-v4'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const ExpandList = defineAsyncComponent(() => import('src/components/list/ExpandList.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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

onMounted(() => {
  if (logined.value) {
    setTimeout(() => {
      initialize()
    }, 2000)
  }
})

</script>

<style lang='sass' scoped>
.dropdown
  min-width: 200px
</style>
