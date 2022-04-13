<script setup lang='ts'>
import { onMounted, computed, watch } from 'vue'
import { useLangStore, NotificationType, useLocaleStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const lang = useLangStore()
const locale = useLocaleStore()
const langID = computed(() => locale.CurLang?.ID)
watch(langID, () => {
  lang.getLangMessages({
    LangID: langID.value as string,
    Message: {
      Error: {
        Title: t('MSG_GET_LANG_MESSAGES'),
        Message: t('MSG_GET_LANG_MESSAGES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  })
})

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
