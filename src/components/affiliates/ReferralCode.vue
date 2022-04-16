<template>
  <h2>{{ $t('MSG_REFERRAL_CODE') }}</h2>
  <div class='content-glass invitation-code row'>
    <span class='content-glass code'>{{ inspire.InvitationCode?.InvitationCode }}</span>
    <div class='column justify-center'>
      <button class='small' @click='onCopyCodeClick'>
        {{ $t('MSG_COPY_CODE') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'
import { NotificationType, useInspireStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import copy from 'copy-to-clipboard'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()

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
  copy(inspire.InvitationCode.InvitationCode)
}

</script>

<stype lang='sass' scoped>
.invitation-code
  margin: 0 auto 0 0 !important
  max-width: 500px
  font-size: 24px
  font-weight: bold

.code
  margin: 0 32px 0 0 !important
  line-height: 32px
  padding: 4px 32px 4px 32px !important
</stype>
