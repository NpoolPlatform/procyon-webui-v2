<template>
  <div class='row'>
    <h2 class='title'>
      {{ $t(label) }}
    </h2>
    <slot name='top-right' />
  </div>
  <div class='mining-summary content-glass'>
    <q-table
      flat
      :bordered='false'
      class='table-box'
      :rows='displayRows'
      :columns='table'
      row-key='ID'
      color='#e1eeef'
      hide-pagination
      :no-data-label='$t("NoData")'
      :rows-per-page-options='[countPerPage]'
      @row-click='(evt, row, index) => onRowClick(row as never)'
    />
    <div class='row'>
      <slot name='bottom-left' />
      <q-space />
      <q-pagination
        color='white'
        active-color='orange-1'
        v-model='page'
        :max='pages'
        :max-pages='9'
        boundary-links
        direction-links
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, ref, computed, defineEmits } from 'vue'

interface Props {
  label: string
  rows: Array<never>
  table: never
  countPerPage: number
}

const props = defineProps<Props>()
const label = toRef(props, 'label')
const rows = toRef(props, 'rows')
const table = toRef(props, 'table')
const countPerPage = toRef(props, 'countPerPage')

const page = ref(1)
const pages = computed(() => rows.value.length / countPerPage.value + rows.value.length % countPerPage.value ? 1 : 0)

const displayRows = computed(() => rows.value.filter((_, index) => index >= countPerPage.value * (page.value - 1) && index < countPerPage.value * page.value))

const emit = defineEmits<{(e: 'row-click', row: never): void}>()

const onRowClick = (row: never) => {
  emit('row-click', row)
}

</script>

<stype lang='sass' scoped>
.table-box
  background: transparent
  border-bottom: 1px solid #23292b
  border-radius: 0
  color: #e1eeef

.table-box >>> th
  font-size: 16px !important

.buttons
  height: 64px

h2
  max-width: 100% !important
  margin-left: 0 !important
</stype>
