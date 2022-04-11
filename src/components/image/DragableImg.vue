/* eslint-disable no-new */
<template>
  <input
    ref='selectImgFile'
    type='file'
    style='display: none;'
    @change='onImgSelected'
    accept='image/jpeg, image/png, image/jpg'
  >
  <img
    :src='src.length ? src : (placeholder.length ? placeholder : addImage)'
    @click='onImgClick'
  >
</template>

<script setup lang='ts'>
import { defineProps, toRef, withDefaults, ref, defineEmits } from 'vue'
import Compressor from 'compressorjs'
import { NotificationType, useNotificationStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import addImage from 'src/assets/icon-plus.svg'

interface Props {
  src: string
  placeholder: string
  selected: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: ''
})
const src = toRef(props, 'src')

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const selectImgFile = ref<HTMLDivElement>()
type Base64Handler = (base64: string) => void
const notification = useNotificationStore()

const toBase64 = (filename: File, onLoaded: Base64Handler) => {
  const maxSize = 4000000
  // eslint-disable-next-line no-new
  new Compressor(filename, {
    convertSize: maxSize,
    success (result: Blob) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if ((reader.result as string).length > maxSize) {
          notification.Notifications.push({
            Title: t('MSG_COMPRESS_IMAGE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          })
          return
        }
        onLoaded(reader.result as string)
      }
      reader.readAsDataURL(result)
    },
    error (err: Error) {
      notification.Notifications.push({
        Title: t('MSG_COMPRESS_IMAGE_FAIL'),
        Description: err.message,
        Popup: true,
        Type: NotificationType.Error
      })
    }
  })
}

const emit = defineEmits<{(e: 'update:src', img: string): void,
  (e: 'update:selected', selected: boolean): void
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
  selectImgFile.value?.click()
}

</script>

<style lang='sass' scoped>
.container
  width: 140px
  height: 120px

.placeholder
  width: 20px
  height: 20px

.img
  width: 140px
  height: 120px
  background-color: #F2F2F2
  border: 1px dashed rgba(45, 45, 45, 0.2)
  border-radius: 4px

.img:hover
  cursor: pointer

.caption
  color: rgba(45, 45, 45, 0.6)
  margin-top: 10px

.full
  width: 100%
  height: 100%
  background-color: transparent
  align-items: center
</style>
