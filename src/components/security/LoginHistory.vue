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
import { useI18n } from 'vue-i18n'
import { NotifyType, useFrontendUserStore, LoginHistory, formatTime } from 'npool-cli-v4'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const user = useFrontendUserStore()
const histories = computed(() => user.loginHistories)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: LoginHistory) => formatTime(row.CreatedAt)
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

const getHistory = (offset: number, limit: number) => {
  user.getLoginHistories({
    offset: offset,
    limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_LOGIN_HISTORIES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (histories: Array<LoginHistory>) => {
    if (histories.length === 0) {
      return
    }
    getHistory(offset + limit, limit)
  })
}

onMounted(() => {
  if (user.History.LoginHistories.length <= 0) {
    getHistory(0, 100)
  }
})

</script>

<stype lang='sass' scoped>
</stype>
