<template>
  <UpdateAccount :account-type='AccountType.Mobile' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { AccountType } from 'npool-cli-v2'

const UpdateAccount = defineAsyncComponent(() => import('src/components/user/UpdateAccount.vue'))

</script>
