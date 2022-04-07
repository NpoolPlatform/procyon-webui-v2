<template>
  <div id='hero'>
    <h1 class='hero'>
      <p class='hero' v-html='$t("MSG_SLOGAN")' />
    </h1>
    <h2 class='hero'>
      {{ $t('MSG_SUB_SLOGAN') }}
    </h2>
    <button>{{ $t('MSG_REGISTER') }}</button>
  </div>
</template>

<script setup lang='ts'>

</script>

<style lang='sass' scoped>
</style>
