<template>
  <BackPage>
    <div class='content'>
      <div class='form-container'>
        <h3 class='form-title'>
          User Registration
        </h3>
        <form @submit='onSubmit' method='POST' action='javascript:void(0)'>
          <slot name='form-body' />
        </form>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import {
  defineAsyncComponent,
  defineEmits
} from 'vue'

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

const emit = defineEmits<{(e: 'submit'): void}>()
const onSubmit = () => {
  emit('submit')
}

</script>
