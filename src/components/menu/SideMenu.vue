<template>
  <div class='sidebar' v-if='setting.ShowSideMenu'>
    <img :src='lightLogo' class='attachment-large size-large logo' @click='onLogoClick'>
    <ul>
      <li><img src='icon-mining.svg'><span>Mining</span></li>
      <li><img src='icon-wallet.svg'><span>Wallet</span></li>
      <li><img src='icon-account.svg'><span>Account</span></li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { useSettingStore } from '../../store/setting'
import { useRouter } from 'vue-router'

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
