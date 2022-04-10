<template>
  <header :class='[ "desktop1", setting.ShowSideMenu ? "with-sidebar" : "" ]'>
    <img v-if='!setting.ShowSideMenu' :src='lightLogo' class='attachment-large size-large logo'>
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='#/blog'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
        <LangSwitcher />
        <SignHelper v-if='!logined.getLogined' />
        <AvatarDropdown v-else>
          <ExpandList
            :menu='menu'
            :show-icon='true'
            :show-icon-right='true'
            :show-label='false'
            :handle-router='false'
            :margin='true'
            @switch-menu='onSwitchMenu'
          />
        </AvatarDropdown>
      </ul>
    </div>
  </header>

  <header class='mobile'>
    <img :src='logo' class='attachment-large size-large logo'>

    <div class='header-inner'>
      <LangSwitcher />
      <SignHelper v-if='!logined.getLogined' />
      <AvatarDropdown v-else>
        <ExpandList
          :menu='menu'
          :show-icon='true'
          :show-icon-right='true'
          :show-label='false'
          :handle-router='false'
          :margin='true'
          @switch-menu='onSwitchMenu'
        />
      </AvatarDropdown>
    </div>
    <div class='hr' />
    <div class='nav'>
      <ul>
        <li><a class='nav-link' href='#'>{{ $t('MSG_HOME') }}</a></li>
        <li><a class='nav-link' href='https://procyon-vip.medium.com'>{{ $t('MSG_BLOG') }}</a></li>
        <li><a class='nav-link' href='#/faq'>{{ $t('MSG_SUPPORT_AND_FAQ') }}</a></li>
        <li><a class='nav-link' href='#/contact'>{{ $t('MSG_CONTACT') }}</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { useInspireStore, useLoginedUserStore, NotificationType } from 'npool-cli-v2'
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { HeaderAvatarMenu, MenuItem } from 'src/menus/menus'
import { useRouter } from 'vue-router'

import lightLogo from '../../assets/procyon-light.svg'
import logo from '../../assets/procyon-logo.svg'
import { useSettingStore } from 'src/store/setting'
import { useI18n } from 'vue-i18n'

const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))
const SignHelper = defineAsyncComponent(() => import('src/components/header/SignHelper.vue'))
const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const ExpandList = defineAsyncComponent(() => import('src/components/list/ExpandList.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = useLoginedUserStore()
const setting = useSettingStore()
const inspire = useInspireStore()

const router = useRouter()

const onSwitchMenu = (item: MenuItem) => {
  if (item.label === 'MSG_LOGOUT') {
    // TODO
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
  myMenu.children = myMenu.children.filter((m) => m.label !== 'MSG_REFERRAL' || inspire.InvitationCode?.InvitationCode?.length)
  return myMenu
})

onMounted(() => {
  inspire.getInvitationCode({
    Message: {
      Error: {
        Title: t('MSG_GET_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

</script>

<style lang='sass' scoped>
</style>
