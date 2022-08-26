<template>
  <RemainderPage
    label='MSG_AFFILIATE_STATUS'
    caption='MSG_AFFILIATE_STATUS_CAPTION'
    submit-text='MSG_PROCEED_TO_AFFILIATE_PAGE'
    cancel-text=''
    @submit='onSubmit'
  />
</template>

<script setup lang='ts'>
import { InvitationCode, useInspireStore } from 'npool-cli-v2'
import {
  defineAsyncComponent
} from 'vue'
import { useRouter } from 'vue-router'

const RemainderPage = defineAsyncComponent(() => import('src/components/remainder/RemainderPage.vue'))

const router = useRouter()
const inspire = useInspireStore()

const onSubmit = () => {
  // FIXME
  inspire.InvitationCode.Confirmed = true
  inspire.updateInvitationCode({
    Info: inspire.InvitationCode as InvitationCode,
    Message: {}
  }, () => {
    // TDOO
  })
  void router.push({ path: '/affiliates' })
}

</script>

<style lang='sass' scoped>
</style>
