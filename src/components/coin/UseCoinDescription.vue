<script setup lang='ts'>
import { onMounted } from 'vue'
import { appcoindescription, notify } from 'src/npoolstore'

const description = appcoindescription.useCoinDescriptionStore()

onMounted(() => {
  if (!description.descriptions(undefined)) {
    getDescriptions(0, 100)
  }
})

const getDescriptions = (offset: number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcoindescription.CoinDescription>) => {
    if (error || !rows?.length) {
      return
    }
    getDescriptions(offset + limit, limit)
  })
}
</script>
