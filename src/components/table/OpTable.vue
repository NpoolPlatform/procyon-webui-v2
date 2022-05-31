<template>
  <div class='row'>
    <h2 class='title'>
      {{ $t(label) }}
    </h2>
    <div>
      <slot name='top-right' />
    </div>
  </div>
  <div>{{ countPerPage }} - {{ page }}</div>
  <div class='mining-summary content-glass'>
    <q-table
      flat
      :bordered='false'
      class='table-box'
      :rows='displayRows'
      :columns='table'
      color='#e1eeef'
      hide-pagination
      :loading='loading'
      :no-data-label='$t("NoData")'
      :rows-per-page-options='[0]'
      @row-click='(evt, row, index) => onRowClick(row as never)'
    >
      <template v-if='customizeBody' #body='myProps'>
        <slot name='table-body' v-bind='myProps' />
      </template>
    </q-table>
    <div class='row'>
      <slot name='bottom-left' />
      <q-space />
      <div class='pagination'>
        <q-pagination
          dense
          color='white'
          active-color='orange-1'
          v-model='page'
          :max='pages'
          :max-pages='5'
          boundary-links
          direction-links
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineProps, toRef, ref, computed, defineEmits, withDefaults, watch } from 'vue'

interface Props {
  label: string
  rows: Array<never>
  table: never
  countPerPage: number
  customizeBody: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  customizeBody: false,
  loading: false
})
const label = toRef(props, 'label')
const rows = toRef(props, 'rows')
const table = toRef(props, 'table')
const countPerPage = toRef(props, 'countPerPage')
const customizeBody = toRef(props, 'customizeBody')
const loading = toRef(props, 'loading')

const page = ref(1)
const pages = computed(() => Math.ceil(rows.value.length / countPerPage.value))

const displayRows = computed(() => rows.value.filter((_, index) => {
  return index >= countPerPage.value * (page.value - 1) && index < countPerPage.value * page.value
}))

watch(countPerPage, () => {
  page.value = 1
})

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

h2
  margin-left: 0 !important

.title
  min-width: 240px

.title::after
  background: linear-gradient(to right, transparent 0, #e1eeef 10%, transparent 100%) !important

button,
input[type='submit']
  text-shadow: none !important

.row
  @media (max-width: $breakpoint-sm-max)
    width: 100%

.pagination
  max-width: 40%
</stype>
