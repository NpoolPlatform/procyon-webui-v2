<template>
  <h2>{{ $t('MSG_SECURITY_SETTINGS') }}</h2>
  <div class='settings'>
    <div class='setting-box column'>
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
    <div class='setting-box column'>
      <div class='settings-box-heading'>
        <img :src='mail'>
        <h3 class='box-title'>
          {{ $t('MSG_EMAIL_ADDRESS') }}
        </h3>
      </div>
      <p>{{ $t('MSG_UPDATE_EMAIL_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.LoginedUser?.User?.EmailAddress?.length ? "verified" : "" ]'>
        <span>{{ $t('MSG_VERIFIED') }}</span>
      </div>
      <q-space />
      <button @click='onUpdateEmailClick'>
        {{ $t('MSG_UPDATE_EMAIL_ADDRESS') }}
      </button>
    </div>
    <div class='setting-box column'>
      <div class='settings-box-heading'>
        <img :src='mobile'>
        <h3 class='box-title'>
          {{ $t('MSG_MOBILE_AUTHENTICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_MOBILE_AUTHENTICATION_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.LoginedUser?.User?.PhoneNO?.length ? "verified" : "" ]'>
        <span>{{ $t('MSG_NOT_VERIFIED') }}</span>
      </div>
      <q-space />
      <button @click='onUpdateMobileClick'>
        {{ $t('MSG_UPDATE_PHONE_NUMBER') }}
      </button>
    </div>
    <div class='setting-box column'>
      <div class='settings-box-heading'>
        <img :src='shieldHalf'>
        <h3 class='box-title'>
          {{ $t('MSG_GOOGLE_AUTHENTICATOR') }}
        </h3>
      </div>
      <p>{{ $t('MSG_GOOGLE_AUTHENTICATE_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified ? "verified" : "" ]'>
        <span>{{ $t('MSG_VERIFIED') }}</span>
      </div>
      <q-space />
      <button @click='onEnableGoogleClick' :disabled='logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified'>
        {{ $t('MSG_ENABLE_2FA_AUTH') }}
      </button>
    </div>
    <div class='setting-box column'>
      <div class='settings-box-heading'>
        <img :src='shieldSolid'>
        <h3 class='box-title'>
          {{ $t('MSG_LOGIN_AUTHENTICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_LOGIN_AUTHENTICATION_TIP') }}</p>
      <div :class='[ "verification", !logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified ? "disabled" : "enabled" ]' @click='onGoogleSignClick'>
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
    <div class='setting-box column'>
      <div class='settings-box-heading'>
        <img :src='id'>
        <h3 class='box-title'>
          {{ $t('MSG_ID_VERIFICATION') }}
        </h3>
      </div>
      <p>{{ $t('MSG_ID_VERIFICATION_TIP') }}</p>
      <div class='verification'>
        <img :src='squareCheck' :class='[ kycVerified ? "verified" : "" ]'>
        <span>{{ $t('MSG_VERIFIED') }}</span>
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
import { useLoginedUserStore, useUserStore, NotificationType, useKYCStore, ReviewState } from 'npool-cli-v2'
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

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = useLoginedUserStore()
const user = useUserStore()
const kyc = useKYCStore()
const kycVerified = computed(() => kyc.KYC?.State === ReviewState.Approved)

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

const signGoogleVerify = ref(logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified && logined.LoginedUser?.Ctrl?.SigninVerifyByGoogleAuthentication)

const onGoogleSignClick = () => {
  if (!logined.LoginedUser?.Ctrl?.GoogleAuthenticationVerified) {
    return
  }
  signGoogleVerify.value = true
}

const onEmailSignClick = () => {
  signGoogleVerify.value = false
}

const onSignVerifyClick = () => {
  if (!logined.LoginedUser?.Ctrl || !logined.LoginedUser.Ctrl.GoogleAuthenticationVerified) {
    return
  }

  logined.LoginedUser.Ctrl.SigninVerifyByGoogleAuthentication = signGoogleVerify.value
  user.updateCtrl({
    Info: logined.LoginedUser.Ctrl,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_USER_CONTROL_FAIL'),
        Popup: true,
        Type: NotificationType.Error
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
