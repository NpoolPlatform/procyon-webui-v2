<template>
  <div class='feature'>
    <div class='content'>
      <h1 class='feature-title'>
        {{ $t('MSG_WHY_PROCYON') }}
      </h1>
      <div class='columns-3'>
        <div class='column-3'>
          <img class='icon' src='../../assets/procyon-graphic-service.svg'>
          <h2 class='feature-title'>
            {{ $t('MSG_WHYME_TITLE_1') }}
          </h2>
          <h3 class='feature-title'>
            {{ $t('MSG_WHYME_SUBTITLE_1') }}
          </h3>
          <p v-html='$t("MSG_WHYME_CONTENT_1")' />
        </div>

        <div class='column-3'>
          <img class='icon' src='../../assets/procyon-graphic-education.svg'>
          <h2 class='feature-title'>
            {{ $t('MSG_WHYME_TITLE_2') }}
          </h2>
          <h3 class='feature-title'>
            {{ $t('MSG_WHYME_SUBTITLE_2') }}
          </h3>
          <p v-html='$t("MSG_WHYME_CONTENT_2")' />
        </div>

        <div class='column-3'>
          <img class='icon' src='../../assets/procyon-graphic-community.svg'>
          <h2 class='feature-title'>
            {{ $t('MSG_WHYME_TITLE_3') }}
          </h2>
          <h3 class='feature-title'>
            {{ $t('MSG_WHYME_SUBTITLE_3') }}
          </h3>
          <p v-html='$t("MSG_WHYME_CONTENT_3")' />
        </div>
      </div>
      <div class='hr' />
      <div class='columns-1'>
        <div class='sub-feature' v-html='$t("MSG_WHYME_SUB_FEATURES")' />
      </div>
    </div>
  </div>
</template>
