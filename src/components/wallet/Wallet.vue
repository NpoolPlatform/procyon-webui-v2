<template>
  <div class='content'>
    <Balance />
    <div class='hr' />
    <Assets />
    <div class='hr' />
    <Transactions />
    <div class='hr' />
    <WithdrawRecords />
    <div class='hr' />
    <WithdrawAddresses />
    <div class='hr' />
  </div>
</template>

<script setup lang="ts">
import { NotificationType } from 'npool-cli-v2'
import { useLocalTransactionStore } from 'src/teststore/mock/transaction'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const Balance = defineAsyncComponent(
  () => import('src/components/wallet/Balance.vue')
)
const Assets = defineAsyncComponent(
  () => import('src/components/wallet/Assets.vue')
)
const Transactions = defineAsyncComponent(
  () => import('src/components/wallet/Transactions.vue')
)
const WithdrawAddresses = defineAsyncComponent(
  () => import('src/components/wallet/WithdrawAddresses.vue')
)
const WithdrawRecords = defineAsyncComponent(
  () => import('src/components/wallet/WithdrawRecords.vue')
)
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const locationTrans = useLocalTransactionStore()

const getWithdraws = (offset: number, limit: number) => {
  locationTrans.getWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAWS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
    if (locationTrans.Withdraws.length === locationTrans.Total) {
      return
    }
    getWithdraws(limit + offset, limit)
  })
}
onMounted(() => {
  locationTrans.$reset()
  getWithdraws(0, 100)
})
</script>
