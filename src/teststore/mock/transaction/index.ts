import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  Detail,
  GetDetailRequest,
  GetDetailResponse,
  GetWithdrawRequest,
  GetWithdrawResponse,
  Withdraw
} from './types'

export const useLocalTransactionStore = defineStore('localtransaction', {
  state: () => ({
    Details: [] as Array<Detail>,
    Total: 0,
    Withdraws: [] as Array<Withdraw>,
    WithdrawTotal: 0
  }),
  getters: {},
  actions: {
    getDetails (req: GetDetailRequest, done: (error: boolean) => void) {
      doActionWithError<GetDetailRequest, GetDetailResponse>(
        API.GET_DETAILS,
        req,
        req.Message,
        (resp: GetDetailResponse): void => {
          resp.Infos.forEach((el) => {
            this.Details.push(el)
          })
          this.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getWithdraws (req: GetWithdrawRequest, done: (error: boolean) => void) {
      doActionWithError<GetWithdrawRequest, GetWithdrawResponse>(
        API.GET_WITHDRAWS,
        req,
        req.Message,
        (resp: GetWithdrawResponse): void => {
          this.Withdraws.push(...resp.Infos)
          this.WithdrawTotal = resp.Total
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
