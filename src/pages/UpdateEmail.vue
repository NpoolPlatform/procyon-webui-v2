<template>
  <UpdateAccount :account-type='AccountType.Email' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { AccountType } from 'npool-cli-v4'

const UpdateAccount = defineAsyncComponent(() => import('src/components/user/UpdateAccount.vue'))

</script>
