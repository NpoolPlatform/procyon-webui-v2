<template>
  <div class='sidebar' v-if='setting.ShowSideMenu'>
    <img :src='lightLogo' class='attachment-large size-large logo' @click='onLogoClick'>
    <ul>
      <div
        v-for='menu in BaseMenu.children'
        :key='menu.menuId'
      >
        <li
          v-if='showMenu(menu)'
          @click='onMenuSwitch(menu)'
          :class='[ menuId === menu.menuId ? "selected" : "" ]'
        >
          <q-icon :name='menu.icon' class='img' />
          <span>{{ $t(menu.label) }}</span>
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { useSettingStore } from 'src/localstore'
import { useRouter } from 'vue-router'
import { BaseMenu, MenuItem } from 'src/menus/menus'
import { onMounted, computed } from 'vue'
import { useInspireStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import lightLogo from '../../assets/procyon-light.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const setting = useSettingStore()
const inspire = useInspireStore()

const router = useRouter()
const onLogoClick = () => {
  void router.push({ path: '/' })
}

const showMenu = (menu: MenuItem) => {
  if (menu.label === 'MSG_REFERRAL' && !inspire.InvitationCode?.InvitationCode?.length) {
    return false
  }
  return true
}

const menuId = computed(() => {
  const index = BaseMenu.children.findIndex((el: MenuItem) => el.target === setting.ActiveMenuTarget)
  return BaseMenu.children[index]?.menuId ? BaseMenu.children[index]?.menuId : BaseMenu.children[0].menuId
})

const onMenuSwitch = (menu: MenuItem) => {
  setting.ActiveMenuTarget = menu.target
  void router.push({ path: menu.target })
}

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
.logo
  cursor: pointer
</style>
