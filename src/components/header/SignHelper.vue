<template>
  <button @click='onRegisterClick'>
    {{ $t('MSG_REGISTER') }}
  </button>
  <button class='alt' @click='onSigninClick'>
    {{ $t('MSG_SIGNIN') }}
  </button>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter()
const onRegisterClick = () => {
  void router.push({ path: '/registration' })
}
const onSigninClick = () => {
  void router.push({ path: '/signin' })
}

</script>

<style lang='sass' scoped>
</style>
