import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  General,
  GetGeneralRequest,
  GetGeneralResponse,
  GetIntervalGeneralRequest,
  GetIntervalGeneralResponse
} from './types'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    Generals: [] as Array<General>,
    Total: 0,
    IntervalGenerals: [] as Array<General>,
    IntervalGeneralsTotal: 0
  }),
  getters: {},
  actions: {
    getGenerals (req: GetGeneralRequest, done: (error: boolean) => void) {
      doActionWithError<GetGeneralRequest, GetGeneralResponse>(
        API.GET_GENERALS,
        req,
        req.Message,
        (resp: GetGeneralResponse): void => {
          this.Generals.push(...resp.Infos)
          this.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getIntervalGenerals (req: GetIntervalGeneralRequest, done: (error: boolean) => void) {
      doActionWithError<GetIntervalGeneralRequest, GetIntervalGeneralResponse>(
        API.GET_INTERVAL_GENERALS,
        req,
        req.Message,
        (resp: GetIntervalGeneralResponse): void => {
          resp.Infos.forEach((el) => {
            this.IntervalGenerals.push(el)
          })
          this.IntervalGeneralsTotal = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
