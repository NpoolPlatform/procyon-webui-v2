import { defineStore } from 'pinia'
import { App } from 'npool-cli-v4'

export const useLocalAppStore = defineStore('local-app-v4', {
  state: () => ({
    App: undefined as unknown as App
  }),
  getters: {
    maintaining (): boolean {
      return this.App && this.App?.Maintaining
    }
  },
  actions: {
    setApp (app: App) {
      this.App = app
    },
    restApp () {
      this.App = undefined as unknown as App
    }
  }
})
