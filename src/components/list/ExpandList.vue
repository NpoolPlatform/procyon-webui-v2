<template>
  <div class='column container'>
    <q-item-label v-if='showLabel' class='menu'>
      {{ $t(menu.label) }}
    </q-item-label>
    <q-item
      dense
      class='menu-item column justify-center'
      v-for='item in menu.children'
      :key='item.menuId'
      @click='onMenuClick(item)'
      clickable
    >
      <q-separator v-if='item.sectionBegin' />
      <div :class='[margin ? "menu-item-margin row" : "row"]'>
        <q-icon class='icon' v-if='showIcon && item.icon && item.icon.length > 0' :name='item.icon' />
        <q-item-label class='menu-item-label'>
          {{ $t(item.label) }}
        </q-item-label>
        <q-space v-if='showIconRight && item.iconRight && item.iconRight.length > 0' />
        <q-img v-if='showIconRight && item.iconRight && item.iconRight.length > 0' :icon='item.iconRight' />
      </div>
    </q-item>
  </div>
</template>

<script setup lang='ts'>
import { withDefaults, toRef, defineProps, defineEmits } from 'vue'
import { MenuItem } from 'src/menus/menus'
import { useRouter } from 'vue-router'

interface Props {
  menu: MenuItem
  showIcon: boolean
  showIconRight: boolean
  showLabel: boolean
  handleRouter: boolean
  margin: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: false,
  showIconRight: false,
  showLabel: true,
  handleRouter: true,
  margin: false
})
const menu = toRef(props, 'menu')
const handleRouter = toRef(props, 'handleRouter')
const margin = toRef(props, 'margin')

const router = useRouter()

const emit = defineEmits<{(e: 'switchMenu', menu: MenuItem): void}>()

const onMenuClick = (item: MenuItem) => {
  if (handleRouter.value) {
    void router.push({ path: item.target })
  } else {
    emit('switchMenu', item)
  }
}

</script>

<style lang='sass' scoped>
.container
  background-color: #23292b

.menu
  font-size: 16px
  margin: 0 0 10px 0

.menu-item
  padding: 0
  min-width: 120px

.menu-item-margin
  padding: 10px 16px

.menu-item:hover
  background-color: $dark
  color: white

.menu-item-label
  line-height: 100% !important

.icon
  width: 16px
  height: 16px
  margin-right: 10px
</style>
