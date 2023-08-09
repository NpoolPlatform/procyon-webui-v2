<template>
  <div class='back-button content-glass' @click='onBackClick'>
    <a><img src='font-awesome/back-arrow.svg'></a>
  </div>
  <slot />
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
import { defineProps, toRef } from 'vue'

interface Props {
  backTarget?: string
}

const props = defineProps<Props>()
const backTarget = toRef(props, 'backTarget')

const router = useRouter()
const onBackClick = () => {
  if (backTarget.value?.length) {
    void router.push({ path: backTarget.value })
    return
  }
  void router.back()
}

</script>

<style lang='sass' scoped>
.back-button
  line-height: 32px
  max-height: 64px
</style>
