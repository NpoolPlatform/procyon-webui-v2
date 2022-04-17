<template>
  <div class='feature'>
    <div class='content'>
      <div class='columns-3'>
        <div class='column-3'>
          <img class='icon' :src='backing'>
          <h3 class='feature-title' v-html='$t("MSG_MARKET_LEADER_TITLE")' />
          <p v-html='$t("MSG_MARKET_LEADER")' />
        </div>

        <div class='column-3'>
          <img class='icon' :src='team'>
          <h3 class='feature-title' v-html='$t("MSG_DREAM_TEAM_TITLE")' />
          <p v-html='$t("MSG_DREAM_TEAM")' />
        </div>

        <div class='column-3'>
          <img class='icon' :src='technology'>
          <h3 class='feature-title' v-html='$t("MSG_BIG_PICTURE_TITLE")' />
          <p v-html='$t("MSG_BIG_PICTURE")' />
        </div>
      </div>
    </div>
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import backing from '../../assets/icon-vc-backing.svg'
import team from '../../assets/icon-team.svg'
import technology from '../../assets/icon-technology.svg'
</script>
