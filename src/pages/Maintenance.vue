<template>
  <header class='desktop1'>
    <img :src='lightLogo' class='attachment-large size-large logo cursor-pointer' @click='onLogoClick'>
    <div class='nav'>
      <ul class='language-picker'>
        <li :class='[ locale === "ja-JP" ? "selected" : "" ]'>
          <a class='language' @click='locale = "ja-JP"'>
            JP
          </a>
        </li>
        <li :class='[ locale === "en-US" ? "selected" : "" ]'>
          <a class='language' @click='locale = "en-US"'>
            EN
          </a>
        </li>
      </ul>
    </div>
  </header>
  <div class='mm' v-if='Maintenance'>
    <Maintenance />
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, watch, ref, Component, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { app, notify } from 'src/npoolstore'
import lightLogo from 'src/assets/procyon-light.svg'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t, locale } = useI18n({ useScope: 'global' })
const Maintenance = ref<Component>()

watch(locale, () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  Maintenance.value = defineAsyncComponent(() => import(`src/pages/maintenance/${locale.value}/Maintenance.vue`))
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
  Maintenance.value = defineAsyncComponent(() => import(`src/pages/maintenance/${locale.value}/Maintenance.vue`))
})

const _app = app.useApplicationStore()

const getApplication = () => {
  _app.getApp({
    Message: {
      Error: {
        Title: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  getApplication()
})

const router = useRouter()
const onLogoClick = () => {
  void router.push({ path: '/' })
}
</script>

<style lang='sass' scoped>
.mm
  margin-top: -96px
</style>
