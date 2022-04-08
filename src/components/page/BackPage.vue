<template>
  <div class='back-button' @click='onBackClick'>
    ⭠
  </div>
  <slot />
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter()
const onBackClick = () => {
  void router.back()
}

</script>

<style lang='sass' scoped>
.back-button
  line-height: 32px
  max-height: 64px
</style>
