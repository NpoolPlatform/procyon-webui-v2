<template>
  <RemainderPage
    label='MSG_ADD_MOBILE_NUMBER'
    caption='MSG_ADD_MOBILE_NUMBER_CAPTION'
    submit-text='MSG_SETUP_MOBILE_NUMBER'
    cancel-text='MSG_SET_MOBILE_LATER'
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
  void router.push({ path: '/update/mobile' })
}
const onCancel = () => {
  void router.back()
}

</script>

<style lang='sass' scoped>
</style>
