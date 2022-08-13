import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  CreateWithdrawRequest,
  CreateWithdrawResponse,
  Detail,
  GetDetailRequest,
  GetDetailResponse,
  GetWithdrawRequest,
  GetWithdrawResponse,
  Withdraw
} from './types'

export const useLocalTransactionStore = defineStore('localtransaction', {
  state: () => ({
    Details: {
      Details: [] as Array<Detail>,
      Total: 0
    },
    Withdraws: {
      Withdraws: [] as Array<Withdraw>,
      Total: 0
    }
  }),
  getters: {
    withdraws (): Array<Withdraw> {
      return this.Withdraws.Withdraws.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1)
    },
    details (): Array<Detail> {
      return this.Details.Details.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1)
    }
  },
  actions: {
    getDetails (req: GetDetailRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetDetailRequest, GetDetailResponse>(
        API.GET_DETAILS,
        req,
        req.Message,
        (resp: GetDetailResponse): void => {
          resp.Infos.forEach((el: Detail) => {
            this.Details.Details.push(el)
          })
          this.Details.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    },
    getWithdraws (req: GetWithdrawRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetWithdrawRequest, GetWithdrawResponse>(
        API.GET_WITHDRAWS,
        req,
        req.Message,
        (resp: GetWithdrawResponse): void => {
          this.Withdraws.Withdraws.push(...resp.Infos)
          this.Withdraws.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    },
    createWithdraw (req: CreateWithdrawRequest, done: (error: boolean) => void) {
      doActionWithError<CreateWithdrawRequest, CreateWithdrawResponse>(
        API.CREATE_WITHDRAW,
        req,
        req.Message,
        (resp: CreateWithdrawResponse): void => {
          this.Withdraws.Withdraws.splice(0, 0, resp.Info)
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
export { AccountType } from './const'
