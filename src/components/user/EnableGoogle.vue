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
import { notify, user, googleauth } from 'src/npoolstore'
import { AppID } from 'src/const/const'
import { onMounted, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))
const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const logined = user.useLocalUserStore()
const ga = googleauth.useGoogleAuthStore()
const googleToken = computed(() => logined.user()?.GoogleOTPAuth)
const googleSecret = computed(() => logined.user()?.GoogleSecret)

const router = useRouter()

const onContinueClick = () => {
  void router.push({ path: '/verify/google' })
}

const onCloseClick = () => {
  void router.back()
}

onMounted(() => {
  if (!googleSecret.value?.length) {
    ga.setupGoogleAuth({
      AppID: AppID,
      UserID: logined.loginedUserID as string,
      Message: {
        Error: {
          Title: 'MSG_SETUP_GOOGLE_AUTHENTICATION',
          Message: 'MSG_SETUP_GOOGLE_AUTHENTICATION_FAIL',
          Popup: true,
          Type: notify.NotifyType.Error
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
