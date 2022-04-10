<template>
  <div class='content'>
    <div class='columns-1'>
      <div v-html='$t("MSG_WHAT_IS_MINING_1")' />
      <img :src='miningVsBuyingLogo'>
      <div v-html='$t("MSG_WHAT_IS_MINING_2")' />
    </div>
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import miningVsBuyingLogo from '../../assets/mining-vs-buying.png'
</script>
