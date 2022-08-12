import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  General,
  GetGeneralRequest,
  GetGeneralResponse,
  GetIntervalGeneralRequest,
  GetIntervalGeneralResponse,
  IntervalGeneral
} from './types'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    Generals: {
      Generals: [] as Array<General>,
      Total: 0
    } as IntervalGeneral,
    IntervalGenerals: new Map<string, IntervalGeneral>()
  }),
  getters: {
    getCoinBalance (): (coinTypeID: string) => number {
      return (coinTypeID: string) => {
        let total = 0
        this.Generals.Generals.filter((el) => el.CoinTypeID === coinTypeID).forEach((sl) => { total += Number(sl.Spendable) })
        return total
      }
    },
    getUSDTBalance (): number {
      return 0
    }
  },
  actions: {
    getGenerals (req: GetGeneralRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetGeneralRequest, GetGeneralResponse>(
        API.GET_GENERALS,
        req,
        req.Message,
        (resp: GetGeneralResponse): void => {
          resp.Infos.forEach((el) => {
            const index = this.Generals.Generals.findIndex((gel) => gel.CoinTypeID === el.CoinTypeID)
            if (index >= 0) {
              return
            }
            this.Generals.Generals.push(el)
          })
          this.Generals.Generals = this.Generals.Generals.sort((a, b) => a.Spendable > b.Spendable ? -1 : 1)
          this.Generals.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    },
    getIntervalGenerals (req: GetIntervalGeneralRequest, intervalKey: string, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetIntervalGeneralRequest, GetIntervalGeneralResponse>(
        API.GET_INTERVAL_GENERALS,
        req,
        req.Message,
        (resp: GetIntervalGeneralResponse): void => {
          if (resp.Infos.length === 0) {
            done(false, 0)
            return
          }

          let generals = this.IntervalGenerals.get(intervalKey)
          if (!generals) {
            generals = {
              Generals: [] as Array<General>,
              Total: 0
            } as IntervalGeneral
          }
          generals.Generals.push(...resp.Infos)
          generals.Total = resp.Total

          this.IntervalGenerals.set(intervalKey, generals)
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
