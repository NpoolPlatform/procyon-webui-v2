import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  GetProfitRequest,
  GetProfitResponse,
  GetIntervalProfitRequest,
  GetIntervalProfitResponse,
  GetGoodProfitRequest,
  GetGoodProfitResponse,
  IntervalGoodProfits,
  IntervalProfits,
  Profit,
  GoodProfit
} from './types'

export const useProfitStore = defineStore('profit', {
  state: () => ({
    Profits: {
      Profits: [] as Array<Profit>,
      Total: 0
    } as IntervalProfits,
    CoinProfits: new Map<string, IntervalProfits>(),
    GoodProfits: new Map<string, IntervalGoodProfits>()
  }),
  getters: {},
  actions: {
    getProfits (req: GetProfitRequest, done: (error: boolean) => void) {
      doActionWithError<GetProfitRequest, GetProfitResponse>(
        API.GET_PROFITS,
        req,
        req.Message,
        (resp: GetProfitResponse): void => {
          this.Profits.Profits.push(...resp.Infos)
          this.Profits.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getIntervalProfits (req: GetIntervalProfitRequest, intervalKey: string, done: (error: boolean) => void) {
      doActionWithError<GetIntervalProfitRequest, GetIntervalProfitResponse>(
        API.GET_INTERVAL_PROFITS,
        req,
        req.Message,
        (resp: GetIntervalProfitResponse): void => {
          let profits = this.CoinProfits.get(intervalKey)
          if (!profits) {
            profits = {
              Profits: [] as Array<Profit>,
              Total: 0
            } as IntervalProfits
          }

          profits.Profits.push(...resp.Infos)
          profits.Total = resp.Total

          this.CoinProfits.set(intervalKey, profits)
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getGoodProfits (req: GetGoodProfitRequest, intervalKey: string, done: (error:boolean) => void) {
      doActionWithError<GetGoodProfitRequest, GetGoodProfitResponse>(
        API.GET_GOOD_PROFITS,
        req,
        req.Message,
        (resp: GetGoodProfitResponse): void => {
          let profits = this.GoodProfits.get(intervalKey)
          if (!profits) {
            profits = {
              Profits: [] as Array<GoodProfit>,
              Total: 0
            } as IntervalGoodProfits
          }

          profits.Profits.push(...resp.Infos)
          profits.Total = resp.Total

          this.GoodProfits.set(intervalKey, profits)
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
