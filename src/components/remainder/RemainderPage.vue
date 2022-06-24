<template>
  <BackPage back-target='/dashboard'>
    <div class='content order-page'>
      <div class='form-container content-glass'>
        <div class='confirmation'>
          <h3>{{ $t(label) }}</h3>
          <p v-html='$t(caption)' />
          <div class='hr' />
          <button v-if='submitText.length > 0' @click='onSubmit'>
            {{ $t(submitText) }}
          </button>
          <button v-if='cancelText.length > 0' class='alt' @click='onCancel'>
            {{ $t(cancelText) }}
          </button>
        </div>
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
import { useRouter } from 'vue-router'

interface Props {
  label: string
  caption: string
  submitText: string
  cancelText: string
}

const props = defineProps<Props>()
const label = toRef(props, 'label')

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const emit = defineEmits<{(e: 'submit'): void}>()
const onSubmit = () => {
  emit('submit')
}

const router = useRouter()

const onCancel = () => {
  void router.push({ path: '/dashboard' })
}

</script>

<style lang='sass' scoped>
</style>
