<template>
  <BackPage>
    <div class='content order-page'>
      <div class='product-container'>
        <div class='product-title-section'>
          <div class='product-page-icon'>
            <img :src='good?.Main?.Logo'>
          </div>
          <h1>{{ good?.Main?.Name }} {{ $t('MSG_MINING') }}</h1>
        </div>
        <slot />
      </div>
      <div class='hr' />
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import {
  useGoodStore,
  NotificationType
} from 'npool-cli-v2'
import { defineAsyncComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Query {
  goodId: string
}

const route = useRoute()
const query = computed(() => route.query as unknown as Query)
const goodId = computed(() => query.value.goodId)

const goods = useGoodStore()
const good = computed(() => goods.getGoodByID(goodId.value))

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

onMounted(() => {
  if (!good.value) {
    goods.getGood({
      ID: goodId.value,
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD'),
          Message: t('MSG_GET_GOOD_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>

<style lang='sass' scoped>
</style>
