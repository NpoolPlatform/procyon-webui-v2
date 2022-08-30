<template>
  <h2>{{ $t('MSG_SECURITY_SETTINGS') }}</h2>
  <div class='settings'>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='lock'>
        <h3 class='box-title'>
          {{ $t('MSG_PASSWORD') }}
        </h3>
      </div>
      <p>{{ $t('MSG_CHANGE_PASSWORD_TIP') }}</p>
      <q-space />
      <button @click='onChangePasswordClick'>
        {{ $t('MSG_CHANGE_PASSWORD') }}
      </button>
    </div>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='mail'>
        <h3 class='box-title'>
          {{ $t('MSG_EMAIL_ADDRESS') }}
        </h3>
      </div>
      <p>{{ $t('MSG_UPDATE_EMAIL_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.User?.EmailAddress?.length ? "verified" : "" ]'>
        <span>
          {{ logined.User?.EmailAddress?.length ? $t('MSG_VERIFIED') + ': ' + logined.User?.EmailAddress : $t('MSG_NOT_VERIFIED') }}
        </span>
      </div>
      <q-space />
      <button @click='onUpdateEmailClick'>
        {{ $t('MSG_UPDATE_EMAIL_ADDRESS') }}
      </button>
    </div>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='mobile'>
        <h3 class='box-title'>
          {{ $t('MSG_MOBILE_AUTHENTICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_MOBILE_AUTHENTICATION_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.User?.PhoneNO?.length ? "verified" : "" ]'>
        <span>
          {{ logined.User?.PhoneNO?.length ? $t('MSG_VERIFIED') + ': ' + logined.User?.PhoneNO : $t('MSG_NOT_VERIFIED') }}
        </span>
      </div>
      <q-space />
      <button @click='onUpdateMobileClick'>
        {{ $t('MSG_UPDATE_PHONE_NUMBER') }}
      </button>
    </div>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='shieldHalf'>
        <h3 class='box-title'>
          {{ $t('MSG_GOOGLE_AUTHENTICATOR') }}
        </h3>
      </div>
      <p>{{ $t('MSG_GOOGLE_AUTHENTICATE_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.User?.GoogleAuthVerified ? "verified" : "" ]'>
        <span>{{ logined.User?.GoogleAuthVerified ? $t('MSG_VERIFIED') : $t('MSG_NOT_VERIFIED') }}</span>
      </div>
      <q-space />
      <button @click='onEnableGoogleClick' :disabled='logined.User?.GoogleAuthVerified'>
        {{ $t('MSG_ENABLE_2FA_AUTH') }}
      </button>
    </div>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='shieldSolid'>
        <h3 class='box-title'>
          {{ $t('MSG_LOGIN_AUTHENTICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_LOGIN_AUTHENTICATION_TIP') }}</p>
      <div
        :class='[ "verification", !logined.User?.GoogleAuthVerified ? "disabled" : "enabled" ]'
        @click='onGoogleSignClick'
      >
        <img :src='circleDot' :class='[ signGoogleVerify ? "verified" : "" ]'>
        <span>{{ $t('MSG_GOOGLE_LOGIN_AUTHENTICATION') }}</span>
      </div>
      <div class='verification enabled' @click='onEmailSignClick'>
        <img :src='circleDot' :class='[ !signGoogleVerify ? "verified" : "" ]'>
        <span>{{ $t('MSG_EMAIL_LOGIN_AUTHENTICATION') }}</span>
      </div>
      <q-space />
      <button @click='onSignVerifyClick'>
        {{ $t('MSG_SUBMIT_CHANGE') }}
      </button>
    </div>
    <div class='setting-box column content-glass'>
      <div class='settings-box-heading'>
        <img :src='id'>
        <h3 class='box-title'>
          {{ $t('MSG_ID_VERIFICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_ID_VERIFICATION_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ kycVerified ? "verified" : "" ]'>
        <span>{{ kycVerified ? $t('MSG_VERIFIED') : $t('MSG_NOT_VERIFIED') }}</span>
      </div>
      <q-space />
      <button @click='onKYCClick'>
        {{ $t('MSG_VERIFY_ID') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

import lock from 'src/assets/lock.svg'
import mail from 'src/assets/mail.svg'
import squareCheck from 'src/assets/square-check.svg'
import mobile from 'src/assets/mobile.svg'
import shieldHalf from 'src/assets/shield-half.svg'
import shieldSolid from 'src/assets/shield-solid.svg'
import circleDot from 'src/assets/circle-dot.svg'
import id from 'src/assets/id.svg'
import {
  KYCState,
  NotifyType,
  SigninVerifyType,
  useFrontendKYCStore,
  useFrontendUserStore,
  useLocalUserStore
} from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = useLocalUserStore()
const kyc = useFrontendKYCStore()
const kycVerified = computed(() => kyc.KYC?.State === KYCState.Approved)

const router = useRouter()

const onChangePasswordClick = () => {
  void router.push({ path: '/update/password' })
}

const onUpdateEmailClick = () => {
  void router.push({ path: '/update/email' })
}

const onUpdateMobileClick = () => {
  void router.push({ path: '/update/mobile' })
}

const onEnableGoogleClick = () => {
  void router.push({ path: '/enable/google' })
}

const signGoogleVerify = ref(
  logined.User?.GoogleAuthVerified && logined.User?.SigninVerifyType === SigninVerifyType.Google
)

const onGoogleSignClick = () => {
  if (!logined.User?.GoogleAuthVerified) {
    return
  }
  signGoogleVerify.value = true
}

const onEmailSignClick = () => {
  signGoogleVerify.value = false
}
const user = useFrontendUserStore()
const onSignVerifyClick = () => {
  if (!logined.User || !logined.User.GoogleAuthVerified) {
    return
  }
  user.updateUser({
    SigninVerifyType: signGoogleVerify.value ? SigninVerifyType.Google : SigninVerifyType.Email,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_USER_CONTROL_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onKYCClick = () => {
  void router.push({ path: '/kyc' })
}

</script>

<style lang='sass' scoped>
.disabled
  cursor: not-allowed

.enabled
  cursor: pointer
</style>
