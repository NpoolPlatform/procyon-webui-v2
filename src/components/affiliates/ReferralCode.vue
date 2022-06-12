<template>
  <h2>{{ $t('MSG_REFERRAL_CODE') }}</h2>
  <div class='row'>
    <div class='content-glass invitation-code row'>
      <span class='code'>
        {{ inviteLink }}
      </span>
      <div class='column justify-center'>
        <button class='small' @click='onCopyCodeClick'>
          {{ $t('MSG_COPY_CODE') }}
        </button>
      </div>
    </div>
    <q-space />
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed } from 'vue'
import { NotificationType, useInspireStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import copy from 'copy-to-clipboard'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const inviteLink = computed(() => 'https://procyon.vip/#/invitation?code=' + (inspire.InvitationCode?.InvitationCode as string))

onMounted(() => {
  if (!inspire.InvitationCode?.InvitationCode?.length) {
    inspire.getInvitationCode({
      Message: {
        Error: {
          Title: t('MSG_GET_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

function onCopyCodeClick () {
  copy(inviteLink.value)
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
