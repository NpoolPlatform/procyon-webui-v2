<template>
  <div ref='headerDiv' class='row'>
    <h2 :style='{"width": titleWidth}'>
      {{ $t(label) }}
    </h2>
    <div ref='topRightSlot'>
      <slot name='top-right' />
    </div>
  </div>
  <div class='mining-summary content-glass'>
    <q-table
      flat
      :bordered='false'
      class='table-box'
      :rows='displayRows'
      :columns='table'
      color='#e1eeef'
      hide-pagination
      :no-data-label='$t("NoData")'
      @row-click='(evt, row, index) => onRowClick(row as never)'
    >
      <template v-if='customizeBody' #body='myProps'>
        <slot name='table-body' v-bind='myProps' />
      </template>
    </q-table>
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
import { defineProps, toRef, ref, computed, defineEmits, withDefaults } from 'vue'

interface Props {
  label: string
  rows: Array<never>
  table: never
  countPerPage: number
  customizeBody: boolean
}

const props = withDefaults(defineProps<Props>(), {
  customizeBody: false
})
const label = toRef(props, 'label')
const rows = toRef(props, 'rows')
const table = toRef(props, 'table')
const countPerPage = toRef(props, 'countPerPage')
const customizeBody = toRef(props, 'customizeBody')

const page = ref(1)
const pages = computed(() => Math.ceil(rows.value.length / countPerPage.value))

const displayRows = computed(() => rows.value.filter((_, index) => index >= countPerPage.value * (page.value - 1) && index < countPerPage.value * page.value))

const emit = defineEmits<{(e: 'row-click', row: never): void}>()

const onRowClick = (row: never) => {
  emit('row-click', row)
}

const topRightSlot = ref<HTMLDivElement>()
const headerDiv = ref<HTMLDivElement>()

const headerWidth = computed(() => headerDiv.value ? headerDiv.value.clientWidth : 0)
const topRightWidth = computed(() => topRightSlot.value ? topRightSlot.value.clientWidth : 0)
const titleWidth = computed(() => (headerWidth.value - topRightWidth.value - 1).toString() + 'px')

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
  max-width: 100% !important
  margin-left: 0 !important

button,
input[type='submit']
  text-shadow: none !important
</stype>
