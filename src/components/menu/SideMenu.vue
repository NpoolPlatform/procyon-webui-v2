<template>
  <div class='sidebar' v-if='setting.ShowSideMenu'>
    <img :src='lightLogo' class='attachment-large size-large logo' @click='onLogoClick'>
    <ul>
      <li v-for='menu in BaseMenu.children' :key='menu.menuId'>
        <q-icon :name='menu.icon' /><span>{{ $t(menu.label) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { useSettingStore } from '../../store/setting'
import { useRouter } from 'vue-router'
import { BaseMenu } from 'src/menus/menus'

import lightLogo from '../../assets/procyon-light.svg'

const setting = useSettingStore()

const router = useRouter()
const onLogoClick = () => {
  void router.push({ path: '/' })
}

</script>

<style lang='sass' scoped>
.logo
  cursor: pointer
</style>
