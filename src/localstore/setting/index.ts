import { defineStore } from 'pinia'
import { SettingState } from './types'

export const useSettingStore = defineStore('localsetting', {
  state: (): SettingState => ({
    ShowSideMenu: false
  }),
  getters: {},
  actions: {}
})
