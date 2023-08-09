<template>
  <select v-model='target' :class='ignoreStyle ? "": "kol-dropdown"' @change='onChange' :disabled='disabled'>
    <option v-for='kol in options' :key='kol' :value='kol'>
      {{ kol }}
    </option>
  </select>
</template>
<script setup lang='ts'>
import { computed, defineProps, ref, toRef, defineEmits } from 'vue'

interface Props {
  percent: number
  max: number
  ignoreStyle?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const percent = toRef(props, 'percent')
const max = toRef(props, 'max')
const ignoreStyle = toRef(props, 'ignoreStyle')
const disabled = toRef(props, 'disabled')

const target = ref(percent.value)

const emit = defineEmits<{(e: 'update:percent', percent: number): void;}>()

const options = computed(() => {
  const percents = [30, 25, 15, 10, 5, 0]
  let index = percents.findIndex(kol => kol <= max.value)
  return index === percents.length - 1 || index === -1 ? [0] : percents.splice(++index)
})

const onChange = () => {
  emit('update:percent', target.value)
}
</script>
<style>
  .kol-dropdown {
    padding: 4px 8px;
    margin: 0;
    width: 52px;
  }

</style>
