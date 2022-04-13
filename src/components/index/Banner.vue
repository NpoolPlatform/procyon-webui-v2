<template>
  <div id='hero'>
    <h1 class='hero'>
      <p class='hero' v-html='$t("MSG_SLOGAN")' />
    </h1>
    <h2 class='hero'>
      {{ $t('MSG_SUB_SLOGAN') }}
    </h2>
    <button v-if='!logined.getLogined' @click='onRegisterClick'>
      {{ $t('MSG_REGISTER') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { useLoginedUserStore } from 'npool-cli-v2'
import { useRouter } from 'vue-router'

const logined = useLoginedUserStore()

const router = useRouter()
const onRegisterClick = () => {
  void router.push({ path: '/registration' })
}

</script>

<style lang='sass' scoped>
</style>
