<template>
  <BackPage>
    <div class='content'>
      <div class='form-container content-glass'>
        <h3 class='form-title'>
          {{ $t('MSG_GOOGLE_AUTHENTICATOR') }}
        </h3>
        <div class='row justify-center'>
          <qrcode-vue class='qr-code' :value='googleToken' :size='250' :margin='3' />
        </div>
        <div class='secret-style'>
          {{ $t('MSG_GOOGLE_SECRET') }}: {{ googleSecret }}
        </div>
        <q-separator />
        <p v-html='$t("MSG_GOOGLE_AUTHENTICATOR_TIP")' />
        <q-separator />
        <div class='row'>
          <q-space />
          <div class='buttons'>
            <button class='alt' @click='onContinueClick'>
              {{ $t('MSG_CONTINUE') }}
            </button>
            <button @click='onCloseClick'>
              {{ $t('MSG_CLOSE') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import {
  NotifyType,
  useLocalUserStore,
  useFrontendGoogleAuthStore
} from 'npool-cli-v4'
import { AppID } from 'src/const/const'
import { onMounted, computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const user = useLocalUserStore()
const ga = useFrontendGoogleAuthStore()
const googleToken = computed(() => user.User.GoogleOTPAuth)
const googleSecret = computed(() => user.User.GoogleSecret)

const router = useRouter()

const onContinueClick = () => {
  void router.push({ path: '/verify/google' })
}

const onCloseClick = () => {
  void router.back()
}

onMounted(() => {
  if (user.User.GoogleSecret.length === 0) {
    ga.setupGoogleAuth({
      AppID: AppID,
      UserID: user.User.ID,
      Message: {
        Error: {
          Title: t('MSG_SETUP_GOOGLE_AUTHENTICATION'),
          Message: t('MSG_SETUP_GOOGLE_AUTHENTICATION_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>

<style lang='sass' scoped>
.secret-style
  font-size: 18px
  font-weight: 600
  margin-bottom: 20px
  text-align: center

.form-container
  max-width: 800px

.qr-code
  border-radius: 12px
  margin-bottom: 24px
</style>
