<template>
  <input
    ref='selectImgFile'
    type='file'
    style='display: none;'
    @change='onImgSelected'
    accept='image/jpeg, image/png, image/jpg'
  >
  <q-img
    fit='contain'
    :src='src.length ? src : (placeholder.length ? placeholder : addImage)'
    :ratio='4/3'
    @click='onImgClick'
    :class='[ "image", updatable ? "" : "disable" ]'
  />
</template>

<script setup lang='ts'>
import { defineProps, toRef, withDefaults, ref, defineEmits } from 'vue'
import Compressor from 'compressorjs'
import { notify } from 'src/npoolstore'

import addImage from 'src/assets/icon-plus.svg'

interface Props {
  src: string
  placeholder: string
  selected: boolean
  updatable: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: ''
})
const src = toRef(props, 'src')
const updatable = toRef(props, 'updatable')

const selectImgFile = ref<HTMLDivElement>()
type Base64Handler = (base64: string) => void
const notification = notify.useNotificationStore()

const toBase64 = (filename: File, onLoaded: Base64Handler) => {
  const maxSize = 4000000
  // eslint-disable-next-line no-new
  new Compressor(filename, {
    convertSize: maxSize,
    success (result: Blob) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if ((reader.result as string).length > maxSize) {
          notification.pushNotification({
            Title: 'MSG_COMPRESS_IMAGE',
            Message: 'MSG_COMPRESS_IMAGE_FAIL',
            Popup: true,
            Type: notify.NotifyType.Error
          })
          return
        }
        onLoaded(reader.result as string)
      }
      reader.readAsDataURL(result)
    },
    error (err: Error) {
      notification.pushNotification({
        Title: 'MSG_COMPRESS_IMAGE',
        Message: 'MSG_COMPRESS_IMAGE_FAIL',
        Description: err.message,
        Popup: true,
        Type: notify.NotifyType.Error
      })
    }
  })
}

const emit = defineEmits<{(e: 'update:src', img: string): void;
  (e: 'update:selected', selected: boolean): void;
}>()

const onImgSelected = (evt: Event) => {
  const target = evt.target as unknown as HTMLInputElement
  if (target.files) {
    const filename = target.files[0]
    toBase64(filename, function (base64: string) {
      emit('update:src', base64)
      emit('update:selected', true)
    })
  }
}

const onImgClick = () => {
  if (!updatable.value) {
    return
  }
  selectImgFile.value?.click()
}

</script>

<style lang='sass' scoped>
.image
  height: 200px

.disable
  cursor: not-allowed
</style>
