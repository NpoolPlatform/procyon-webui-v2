<template>
  <h2>{{ $t('MSG_REFERRAL_CODE') }}</h2>
  <div class='ref-box content-glass'>
    <div class='ref-box-inner'>
      <span class='referral-code'>
        {{ inviteLink }}
      </span>
      <button @click='onCopyCodeClick'>
        {{ $t('MSG_COPY_CODE') }}
      </button>
    </div>
    <q-space />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { NotificationType, useNotificationStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import copy from 'copy-to-clipboard'
import { useLocalUserStore } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const logined = useLocalUserStore()
const inviteLink = computed(() => 'https://procyon.vip/#/invitation?code=' + (logined.User?.InvitationCode))
const notification = useNotificationStore()

function onCopyCodeClick () {
  copy(inviteLink.value)
  notification.Notifications.push({
    Title: t('MSG_REFERRAL_CODE_COPIED'),
    Message: t('MSG_COPY_REFERRAL_CODE_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
  })
}

</script>

<stype lang='sass' scoped>
.invitation-code
  margin: 0 auto 0 0 !important
  font-size: 24px
  font-weight: bold

.code
  word-break: break-all
  margin: 0 32px 0 0 !important
  line-height: 32px
  padding: 4px 32px 4px 32px !important
</stype>
