<template>
  <button
    :type='type'
    :disabled='disabled'
    @click='onClick'
  >
    <div v-if='!waiting'>
      {{ $t(label) }}
    </div>
    <q-spinner
      v-else
      color='primary'
      size='1.5em'
    />
  </button>
</template>

<script setup lang='ts'>
import { defineProps, toRef, defineEmits } from 'vue'

interface Props {
  waiting: boolean
  label: string
  type: 'button' | 'submit' | 'reset' | undefined
  disabled: boolean
}

const props = defineProps<Props>()
const waiting = toRef(props, 'waiting')
const label = toRef(props, 'label')
const type = toRef(props, 'type')
const disabled = toRef(props, 'disabled')

const emit = defineEmits<{(e: 'click'): void}>()

const onClick = () => {
  emit('click')
}

</script>
