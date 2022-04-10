<template>
  <ShowSwitchTable
    label='MSG_DIRECT_AFFILIATES'
    :rows='(referrals as Array<never>)'
    :table='(table as never)'
    :customize-body='true'
  >
    <template #table-body='myProps'>
      <q-tr :props='myProps'>
        <q-td key='Name' :props='myProps'>
          {{ myProps.row.User.EmailAddress.length > 0 ? myProps.row.User.EmailAddress : myProps.row.User.PhoneNO }}
        </q-td>
        <q-td key='JoinDate' :props='myProps'>
          {{ formatTime(myProps.row.User.CreateAt, true) }}
        </q-td>
        <q-td key='Purchased' :props='myProps'>
          <div v-for='summary in myProps.row.Summaries' :key='summary.CoinTypeID'>
            <span>{{ summary.CoinName }}: </span>
            <span class='sales-number'>{{ summary.Units }}</span>
            <span> {{ summary.Unit }} / </span>
            <span class='sales-number'>{{ Math.floor(summary.Amount) }}</span>
            <span> {{ PriceCoinName }}</span>
          </div>
        </q-td>
        <q-td key='TotalPayment' :props='myProps'>
          {{ myProps.row.USDAmount.toFixed(4) }} {{ PriceCoinName }}
        </q-td>
        <q-td key='ReferralValue' :props='myProps'>
          {{ myProps.row.SubUSDAmount.toFixed(4) }} {{ PriceCoinName }}
        </q-td>
      </q-tr>
    </template>
  </ShowSwitchTable>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { NotificationType, formatTime, Referral, useInspireStore, PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const referrals = computed(() => inspire.Referrals.filter((referral) => !referral.Kol))

const table = computed(() => [
  {
    name: 'Name',
    label: t('MSG_USERNAME'),
    align: 'center',
    field: (row: Referral) => row
  },
  {
    name: 'JoinDate',
    label: t('MSG_JOIN_DATE'),
    align: 'center',
    field: (row: Referral) => row
  },
  {
    name: 'Purchased',
    label: t('MSG_PURCHASED'),
    align: 'center',
    field: (row: Referral) => row
  },
  {
    name: 'TotalPayment',
    label: t('MSG_TOTAL_PAYMENT'),
    align: 'center',
    field: (row: Referral) => row
  },
  {
    name: 'ReferralValue',
    label: t('MSG_REFERRAL_VALUE'),
    align: 'center',
    field: (row: Referral) => row
  }
])

onMounted(() => {
  if (referrals.value.length === 0) {
    inspire.getReferrals({
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>

<stype lang='sass' scoped>
</stype>
