<template>
  <Contact />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Contact = defineAsyncComponent(() => import('src/components/contact/Contact.vue'))

</script>
