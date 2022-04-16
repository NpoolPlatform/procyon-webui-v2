<template>
  <RemainderPage
    label='MSG_SETUP_KYC'
    caption='MSG_SETUP_KYC_CAPTION'
    submit-text='MSG_PROCEED_KYC_SETUP'
    cancel-text='MSG_SETUP_KYC_LATER'
    @submit='onSubmit'
    @cancel='onCancel'
  />
</template>

<script setup lang='ts'>
import {
  defineAsyncComponent
} from 'vue'
import { useRouter } from 'vue-router'

const RemainderPage = defineAsyncComponent(() => import('src/components/remainder/RemainderPage.vue'))

const router = useRouter()

const onSubmit = () => {
  void router.push({ path: '/kyc' })
}
const onCancel = () => {
  void router.back()
}

</script>

<style lang='sass' scoped>
</style>
