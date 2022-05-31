<template>
  <OpTable
    :label='label'
    :rows='rows'
    :table='(table as never)'
    :count-per-page='countPerPage'
    :customize-body='customizeBody'
    @row-click='(row: never) => onRowClick(row as never)'
  >
    <template #table-body='myProps'>
      <slot name='table-body' v-bind='myProps' />
    </template>
    <template #top-right>
      <slot name='top-right' />
    </template>
    <template #bottom-left>
      <div class='buttons'>
        <button class='alt' @click='onShowSwitchClick'>
          {{ showMore ? $t('MSG_SHOW_LESS') : $t('MSG_SHOW_MORE') }}
        </button>
      </div>
    </template>
  </OpTable>
</template>

<script setup lang='ts'>
import { defineProps, toRef, ref, defineEmits, defineAsyncComponent, withDefaults } from 'vue'

const OpTable = defineAsyncComponent(() => import('src/components/table/OpTable.vue'))

interface Props {
  label: string
  rows: Array<never>
  table: never
  customizeBody: boolean
}

const props = withDefaults(defineProps<Props>(), {
  customizeBody: false
})
const label = toRef(props, 'label')
const rows = toRef(props, 'rows')
const table = toRef(props, 'table')
const customizeBody = toRef(props, 'customizeBody')

const countPerPage = ref(2)
const showMore = ref(false)

const emit = defineEmits<{(e: 'row-click', row: never): void}>()

const onRowClick = (row: never) => {
  emit('row-click', row)
}

const onShowSwitchClick = () => {
  showMore.value = !showMore.value
  countPerPage.value = showMore.value ? 10 : 2
}

</script>

<stype lang='sass' scoped>
</stype>
