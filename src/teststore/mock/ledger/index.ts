import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  General,
  GetGeneralRequest,
  GetGeneralResponse,
  GetIntervalGeneralRequest,
  GetIntervalGeneralResponse,
  Detail,
  GetDetailRequest,
  GetDetailResponse
} from './types'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    Generals: [] as Array<General>,
    Total: 0,
    IntervalGenerals: [] as Array<General>,
    IntervalGeneralsTotal: 0,
    Details: [] as Array<Detail>,
    DetailTotal: 0
  }),
  getters: {},
  actions: {
    getGenerals (req: GetGeneralRequest, done: (error: boolean) => void) {
      doActionWithError<GetGeneralRequest, GetGeneralResponse>(
        API.GET_GENERALS,
        req,
        req.Message,
        (resp: GetGeneralResponse): void => {
          resp.Infos.forEach((el) => {
            this.Generals.push(el)
          })
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
    },
    getDetails (req: GetDetailRequest, done: (error: boolean) => void) {
      doActionWithError<GetDetailRequest, GetDetailResponse>(
        API.GET_DETAILS,
        req,
        req.Message,
        (resp: GetDetailResponse): void => {
          resp.Infos.forEach((el) => {
            this.Details.push(el)
          })
          this.DetailTotal = resp.Total
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
