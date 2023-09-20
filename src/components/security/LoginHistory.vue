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
import { user, notify, utils } from 'src/npoolstore'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _user = user.useUserStore()
const histories = computed(() => _user.loginHistories)

const table = computed(() => [
  {
    name: 'Date',
    label: t('MSG_DATE'),
    align: 'left',
    field: (row: user.LoginHistory) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'IP Addr',
    label: t('MSG_IP_ADDRESS'),
    align: 'center',
    field: (row: user.LoginHistory) => row.ClientIP
  },
  {
    name: 'Location',
    label: t('MSG_LOCATION'),
    align: 'center',
    field: (row: user.LoginHistory) => row.Location
  }
])

const getHistory = (offset: number, limit: number) => {
  _user.getLoginHistories({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_LOGIN_HISTORIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, histories?: Array<user.LoginHistory>) => {
    if (error || !histories?.length) {
      return
    }
    getHistory(offset + limit, limit)
  })
}

onMounted(() => {
  if (!_user.loginHistories) {
    getHistory(0, 100)
  }
})

</script>

<style lang='sass' scoped>
</style>
