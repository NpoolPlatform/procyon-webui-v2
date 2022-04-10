<template>
  <OpTable
    label='MSG_LOGIN_HISTORY'
    :rows='(histories as Array<never>)'
    :table='(table as never)'
    :count-per-page='10'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { formatTime, NotificationType, useUserStore, LoginHistory } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const user = useUserStore()
const histories = computed(() => user.LoginHistories)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: LoginHistory) => formatTime(row.CreateAt)
  },
  {
    name: 'IP Addr',
    label: t('MSG_IP_ADDRESS'),
    align: 'center',
    field: (row: LoginHistory) => row.ClientIP
  },
  {
    name: 'Location',
    label: t('MSG_LOCATION'),
    align: 'center',
    field: (row: LoginHistory) => row.Location
  }
])

onMounted(() => {
  if (user.LoginHistories.length <= 0) {
    user.getLoginHistories({
      Message: {
        Error: {
          Title: t('MSG_GET_LOGIN_HISTORIES_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
})

</script>

<stype lang='sass' scoped>
</stype>
