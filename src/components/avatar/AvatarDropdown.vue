<template>
  <q-btn-dropdown
    class='user-icon'
    flat
    dense
    rounded
    size='1.3rem'
    :dropdown-icon='icon'
  >
    <slot />
  </q-btn-dropdown>
</template>

<script setup lang='ts'>
import { defineProps, withDefaults, computed } from 'vue'

import avatar from '../../assets/icon-user.svg'

interface Props {
  icon: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: avatar
})

const icon = computed(() => 'img:' + props.icon)

</script>

<style lang='sass' scoped>
.user-icon
  padidng: 8px 0 !important

::v-deep .q-focus-helper
  display: none !important
  width: 0
</style>
