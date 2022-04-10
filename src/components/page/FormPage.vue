<template>
  <BackPage>
    <div class='content'>
      <div class='form-container'>
        <div class='row'>
          <h3 class='form-title'>
            {{ $t(label) }}
          </h3>
          <q-space />
          <div class='top-right'>
            <slot name='top-right' />
          </div>
        </div>
        <form @submit='onSubmit' method='POST' action='javascript:void(0)'>
          <slot name='form-body' />
          <input type='submit' :value='$t(submitText)' class='register'>
          <slot name='append-submit' />
        </form>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import {
  defineAsyncComponent,
  defineEmits,
  defineProps,
  toRef
} from 'vue'

interface Props {
  label: string
  submitText: string
}

const props = defineProps<Props>()
const label = toRef(props, 'label')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const emit = defineEmits<{(e: 'submit'): void}>()
const onSubmit = () => {
  emit('submit')
}

</script>

<style lang='sass' scoped>
.top-right
  margin-top: -48px
  margin-right: -48px
</style>
