<template>
  <h2>{{ $t('MSG_PREMIERE_PRODUCTS') }}</h2>
  <!-- <CardLarge
    v-show='firstGood'
    :good='firstGood'
    project-class='project-aleo'
    bg-img='product/aleo/aleo-banner.jpg'
    purchase-caption='MSG_ALEO_PURCHASE_CAPTION'
  /> -->
  <div class='products'>
    <CardSmall v-for='g in appPowerRentals' :key='g.EntID' :good='g' />
  </div>
  <div class='hr' />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { sdk } from 'src/npoolstore'

const CardSmall = defineAsyncComponent(() => import('src/components/product/CardSmall.vue'))

const appPowerRentals = computed(() => sdk.appPowerRentals.value)

onMounted(() => {
  if (appPowerRentals.value.length > 0) {
    return
  }
  if (!appPowerRentals.value.length) {
    sdk.getAppPowerRentals(0, 0)
  }
})

</script>
