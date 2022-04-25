<template>
  <label for='phone'>{{ $t('MSG_PHONE_NO') }}</label>
  <div class='row'>
    <CountrySelector class='code' v-model:country='country' />
    <input
      type='text'
      id='phone'
      name='phone'
      required
      :placeholder='$t("MSG_PHONE_NO_PLACEHOLDER")'
      :class='[ error ? "error" : "" ]'
      v-model='myValue'
      @focus='onFocus'
      @blur='onBlur'
    >
  </div>
  <div class='error-message'>
    <span>{{ error ? $t('MSG_PHONE_TIP') : '' }}</span>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, defineEmits, watch, ref, defineAsyncComponent } from 'vue'
import { Country } from 'npool-cli-v2'

interface Props {
  value: string
  error: boolean
}

const CountrySelector = defineAsyncComponent(() => import('src/components/lang/CountrySelector.vue'))

const props = defineProps<Props>()
const error = toRef(props, 'error')
const value = toRef(props, 'value')

const myValue = ref(value.value)
const country = ref(undefined as unknown as Country)

const emit = defineEmits<{(e: 'update:value', value: string): void,
  (e: 'focus'): void,
  (e: 'blur'): void
}>()
watch(myValue, () => {
  emit('update:value', country.value?.Code.replace(/ /g, '') + myValue.value.replace(/ /g, ''))
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
  margin: 8px 0 4px -120px
  padding-left: 120px
  max-height: 45px

.code
  width: 120px
  margin-top: 8px
  max-height: 45px
</style>
