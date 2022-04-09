<template>
  <q-btn-dropdown
    class='user-icon'
    flat
    dense
    rounded
    :ripple='false'
    size='1.3rem'
    :dropdown-icon='icon'
    auto-close
    menu-self='top end'
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
::v-deep .q-focus-helper
  display: none !important

button
  background: transparent !important
  margin: auto 0 !important
  height: 100% !important
</style>
