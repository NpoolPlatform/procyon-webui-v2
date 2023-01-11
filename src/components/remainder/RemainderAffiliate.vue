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
import { useFrontendUserStore, User } from 'npool-cli-v4'
import {
  defineAsyncComponent
} from 'vue'
import { useRouter } from 'vue-router'

const RemainderPage = defineAsyncComponent(() => import('src/components/remainder/RemainderPage.vue'))

const router = useRouter()

const user = useFrontendUserStore()

const onSubmit = () => {
  user.updateUser({
    KolConfirmed: true,
    Message: {}
  }, (u: User, error: boolean) => {
    if (error) {
      return
    }
    void router.push({ path: '/affiliates' })
  })
}

</script>

<style lang='sass' scoped>
</style>
