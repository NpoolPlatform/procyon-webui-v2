<template>
  <div class='content'>
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
        <button>{{ $t('MSG_CHANGE_PASSWORD') }}</button>
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
          <img :src='squareCheck' class='verified'>
          <span>{{ $t('MSG_VERIFIED') }}</span>
        </div>
        <q-space />
        <button>{{ $t('MSG_UPDATE_EMAIL_ADDRESS') }}</button>
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
          <img :src='squareCheck' class=''>
          <span>{{ $t('MSG_NOT_VERIFIED') }}</span>
        </div>
        <q-space />
        <button>{{ $t('MSG_UPDATE_PHONE_NUMBER') }}</button>
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
          <img :src='squareCheck' class='verified'>
          <span>{{ $t('MSG_VERIFIED') }}</span>
        </div>
        <q-space />
        <button>{{ $t('MSG_ENABLE_2FA_AUTH') }}</button>
      </div>
      <div class='setting-box column'>
        <div class='settings-box-heading'>
          <img :src='shieldSolid'>
          <h3 class='box-title'>
            {{ $t('MSG_LOGIN_AUTHENTICATION') }}
          </h3>
        </div>
        <p>{{ $t('MSG_LOGIN_AUTHENTICATION_TIP') }}</p>
        <div class='verification'>
          <img :src='circleDot' class='verified'>
          <span>{{ $t('MSG_GOOGLE_LOGIN_AUTHENTICATION') }}</span>
        </div>
        <div class='verification'>
          <img :src='circleDot' class=''>
          <span>{{ $t('MSG_EMAIL_LOGIN_AUTHENTICATION') }}</span>
        </div>
        <q-space />
        <button>{{ $t('MSG_SUBMIT_CHANGE') }}</button>
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
          <img :src='squareCheck' class='verified'>
          <span>{{ $t('MSG_VERIFIED') }}</span>
        </div>
        <q-space />
        <button class='in-active'>
          {{ $t('MSG_VERIFY_ID') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>

import lock from 'src/assets/lock.svg'
import mail from 'src/assets/mail.svg'
import squareCheck from 'src/assets/square-check.svg'
import mobile from 'src/assets/mobile.svg'
import shieldHalf from 'src/assets/shield-half.svg'
import shieldSolid from 'src/assets/shield-solid.svg'
import circleDot from 'src/assets/circle-dot.svg'
import id from 'src/assets/id.svg'

</script>
