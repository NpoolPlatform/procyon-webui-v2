<script setup lang='ts'>
import { AppCoin, NotifyType, useAdminAppCoinStore } from 'npool-cli-v4'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coin = useAdminAppCoinStore()

onMounted(() => {
  coin.$reset()
  getCoins(0, 100)
})

const getCoins = (offset: number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COINS'),
        Message: t('MSG_GET_COINS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCoin>) => {
    if (error || rows.length < limit) {
      return
    }
    getCoins(offset + limit, limit)
  })
}
</script>
