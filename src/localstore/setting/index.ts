import { defineStore } from 'pinia'
import { SettingState } from './types'

export const useSettingStore = defineStore('localsetting', {
  state: (): SettingState => ({
    ShowSideMenu: false,
    ActiveMenuTarget: undefined as unknown as string,
    ShowMainHeader: true
  }),
  getters: {},
  actions: {}
})
