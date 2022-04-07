<template>
  <label :for='id'>{{ $t(label) }}</label>
  <input
    :type='type'
    :id='id'
    :name='name'
    :required='required'
    :placeholder='$t(placeholder)'
    :class='[ error ? "error" : "" ]'
    v-model='myValue'
    @focus='onFocus'
    @blur='onBlur'
  >
  <div class='error-message'>
    <span>{{ error ? $t(message) : '' }}</span>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, defineEmits, watch, ref } from 'vue'

interface Props {
  value: string
  label: string
  type: string
  name?: string
  id: string
  required: boolean
  error: boolean
  message: string
  placeholder: string
}

const props = defineProps<Props>()
const label = toRef(props, 'label')
const type = toRef(props, 'type')
const name = toRef(props, 'name')
const id = toRef(props, 'id')
const required = toRef(props, 'required')
const error = toRef(props, 'error')
const message = toRef(props, 'message')
const placeholder = toRef(props, 'placeholder')
const value = toRef(props, 'value')

const myValue = ref(value.value)

const emit = defineEmits<{(e: 'update:value', value: string): void,
  (e: 'focus'): void,
  (e: 'blur'): void
}>()
watch(myValue, () => {
  emit('update:value', myValue.value)
})

const onFocus = () => {
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}

</script>

<style lang='sass' scoped>
input
  margin: 8px 0 4px 0
</style>
