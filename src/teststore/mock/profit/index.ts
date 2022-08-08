import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  Profit,
  GoodProfit,
  GetProfitRequest,
  GetProfitResponse,
  GetIntervalProfitRequest,
  GetIntervalProfitResponse,
  GetGoodProfitRequest,
  GetGoodProfitResponse
} from './types'

export const useProfitStore = defineStore('profit', {
  state: () => ({
    Profits: [] as Array<Profit>,
    IntervalProfits: [] as Array<Profit>,
    GoodProfits: [] as Array<GoodProfit>,
    Total: 0,
    IntervalTotal: 0,
    GoodProfitTotal: 0
  }),
  getters: {},
  actions: {
    getProfits (req: GetProfitRequest, done: (error: boolean) => void) {
      doActionWithError<GetProfitRequest, GetProfitResponse>(
        API.GET_PROFITS,
        req,
        req.Message,
        (resp: GetProfitResponse): void => {
          this.Profits.push(...resp.Infos)
          this.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getIntervalProfits (req: GetIntervalProfitRequest, done: (error: boolean) => void) {
      doActionWithError<GetIntervalProfitRequest, GetIntervalProfitResponse>(
        API.GET_INTERVAL_PROFITS,
        req,
        req.Message,
        (resp: GetIntervalProfitResponse): void => {
          this.IntervalProfits.push(...resp.Infos)
          this.IntervalTotal = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getGoodProfits (req: GetGoodProfitRequest, done: (error:boolean) => void) {
      doActionWithError<GetGoodProfitRequest, GetGoodProfitResponse>(
        API.GET_GOOD_PROFITS,
        req,
        req.Message,
        (resp: GetGoodProfitResponse): void => {
          this.GoodProfits.push(...resp.Infos)
          this.GoodProfitTotal = resp.Total
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
