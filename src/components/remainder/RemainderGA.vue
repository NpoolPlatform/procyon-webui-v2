<template>
  <RemainderPage
    label='MSG_SETUP_GOOGLE_AUTHENTICATOR'
    caption='MSG_SETUP_GOOGLE_AUTHENTICATOR_CAPTION'
    submit-text='MSG_SETUP_TWO_FACTOR_AUTH'
    cancel-text='MSG_SETUP_LATER'
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
  void router.push({ path: '/enable/google' })
}
const onCancel = () => {
  void router.back()
}

</script>

<style lang='sass' scoped>
</style>
