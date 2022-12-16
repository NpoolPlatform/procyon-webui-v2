<script setup lang='ts'>
import { CoinDescription, NotifyType, useAdminCoinDescriptionStore } from 'npool-cli-v4'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const description = useAdminCoinDescriptionStore()

onMounted(() => {
  if (description.CoinDescriptions.CoinDescriptions.length === 0) {
    getDescriptions(0, 100)
  }
})

const getDescriptions = (offset: number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COIN_DESCRIPTIONS'),
        Message: t('MSG_GET_COIN_DESCRIPTIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<CoinDescription>) => {
    if (error || rows.length < limit) {
      return
    }
    getDescriptions(offset + limit, limit)
  })
}
</script>
