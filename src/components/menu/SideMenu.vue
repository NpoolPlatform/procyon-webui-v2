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
        >
          <q-icon :name='menu.icon' class='img' />
          <span>{{ $t(menu.label) }}</span>
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { useSettingStore } from '../../store/setting'
import { useRouter } from 'vue-router'
import { BaseMenu, MenuItem } from 'src/menus/menus'
import { onMounted } from 'vue'

import lightLogo from '../../assets/procyon-light.svg'
import { useInspireStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

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

const onMenuSwitch = (menu: MenuItem) => {
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
