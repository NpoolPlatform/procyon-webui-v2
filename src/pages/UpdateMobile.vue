<template>
  <UpdateAccount :account-type='appuserbase.SignMethodType.Mobile' />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { appuserbase } from 'src/npoolstore'

const UpdateAccount = defineAsyncComponent(() => import('src/components/user/UpdateAccount.vue'))

</script>
