import { defineStore } from 'pinia'
import { SettingState } from './types'

export const useSettingStore = defineStore('local-setting', {
  state: (): SettingState => ({
    ShowSideMenu: false,
    ActiveMenuTarget: undefined as unknown as string,
    ShowMainHeader: true,
    ShowFooterTop: true
  }),
  getters: {},
  actions: {}
})
