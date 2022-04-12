<template>
  <div id='hero'>
    <h1 class='hero'>
      <p class='hero' v-html='$t("MSG_SLOGAN")' />
    </h1>
    <h2 class='hero'>
      {{ $t('MSG_SUB_SLOGAN') }}
    </h2>
    <button v-if='!logined.getLogined'>
      {{ $t('MSG_REGISTER') }}
    </button>
  </div>
</template>

<script setup lang='ts'>
import { useLoginedUserStore } from 'npool-cli-v2'

const logined = useLoginedUserStore()

</script>

<style lang='sass' scoped>
</style>
