<template>
  <div class='sidebar' v-if='setting.ShowSideMenu'>
    <ul>
      <div
        v-for='menu in BaseMenu.children'
        :key='menu.menuId'
      >
        <li
          v-if='showMenu(menu)'
          @click='onMenuSwitch(menu)'
          :class='[ menuId === menu.menuId ? "current-page" : "" ]'
        >
          <img :src='menu.icon'>
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
import { computed } from 'vue'
import { useLocalUserStore } from 'npool-cli-v4'

const setting = useSettingStore()
const user = useLocalUserStore()

const router = useRouter()

const showMenu = (menu: MenuItem) => {
  if (menu.label === 'MSG_REFERRAL' && !user.User?.InvitationCode?.length) {
    return false
  }
  if (menu.label === 'MSG_ALEO_PURCHASE') {
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

</script>

<style lang='sass' scoped>
</style>
