<template>
  <div class='row no-wrap'>
    <div class='column justify-center'>
      <img class='table-coin-icon' :src='logo'>
    </div>
    <div class='column justify-center'>
      {{ name }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef } from 'vue'

interface Props {
  logo: string;
  name: string;
}

const props = defineProps<Props>()
const name = toRef(props, 'name')
const logo = toRef(props, 'logo')

</script>
<style lang='sass' scoped>
.no-wrap
  @media (max-width: $breakpoint-sm-max)
    white-space: nowrap
</style>
