<script setup lang='ts'>
import { onMounted } from 'vue'
import { useLangStore, NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const lang = useLangStore()

onMounted(() => {
  lang.getLangs({
    Message: {
      Error: {
        Title: t('MSG_GET_LANGS'),
        Message: t('MSG_GET_LANGS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

</script>
