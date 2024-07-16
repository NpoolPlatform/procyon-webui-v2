<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { app, sdk, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const application = app.useApplicationStore()
const appPowerRentals = computed(() => sdk.powerRentals.value)

onMounted(() => {
  if (!appPowerRentals.value?.length) {
    sdk.appPowerRental.getAppPowerRentals(0, 0)
  }
  getApplication()
})

const getApplication = () => {
  application.getApp({
    Message: {
      Error: {
        Title: t('MSG_GET_APP'),
        Message: t('MSG_GET_APP_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
