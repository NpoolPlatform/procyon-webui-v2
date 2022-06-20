import { defineStore } from 'pinia'
import { GoodState } from './types'

export const useLocalGoodStore = defineStore('localgood', {
  state: (): GoodState => ({
    Goods: []
  }),
  getters: {},
  actions: {}
})

export * from './types'
