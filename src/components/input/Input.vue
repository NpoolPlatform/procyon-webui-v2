<template>
  <div v-if='label?.length'>
    <label :for='id'> <span v-html='$t(label)' /></label>
  </div>
  <div v-if='caption?.length'>
    <span class='caption'>({{ $t(caption) }})</span>
  </div>
  <input
    ref='input'
    :type='type'
    :id='id'
    :name='name'
    :required='required'
    :placeholder='$t(placeholder)'
    :class='[ error ? "error" : "" ]'
    :max='max'
    :min='min'
    :autocomplete='autocomplete ? "on" : "new-password"'
    v-model='myValue'
    @focus='onFocus'
    @blur='onBlur'
    :disabled='disabled'
    @invalid='onInvalid(t(message))'
  >
  <div class='error-message'>
    <span>{{ error ? $t(message) : '' }}</span>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, defineEmits, watch, ref, withDefaults } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  value: string | number
  label?: string
  type: string
  name?: string
  id: string
  required: boolean
  error: boolean
  message: string
  placeholder: string
  caption?: string
  max?: number
  min?: number
  autocomplete?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autocomplete: true,
  label: undefined,
  name: undefined,
  caption: undefined,
  max: undefined,
  min: undefined,
  disabled: false
})
const label = toRef(props, 'label')
const type = toRef(props, 'type')
const name = toRef(props, 'name')
const id = toRef(props, 'id')
const required = toRef(props, 'required')
const error = toRef(props, 'error')
const message = toRef(props, 'message')
const placeholder = toRef(props, 'placeholder')
const value = toRef(props, 'value')
const caption = toRef(props, 'caption')

const myValue = ref(value.value)

const emit = defineEmits<{(e: 'update:value', value: string | number): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>()
watch(myValue, () => {
  emit('update:value', myValue.value)
})

const onFocus = () => {
  input.value?.setCustomValidity('')
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}

const input = ref<HTMLInputElement>()

const onInvalid = (str: string) => {
  input.value?.setCustomValidity(str)
}

</script>

<style lang='sass' scoped>
input
  margin: 8px 0 4px 0

.caption
  font-size: 12px

.error-message span
  display: inline-block
  font-size: 12px
  margin-top: -12px
</style>
