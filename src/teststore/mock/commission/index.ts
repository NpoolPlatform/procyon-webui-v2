import { defineStore } from 'pinia'
import { API } from './const'
import {
  CreateCommissionRequest,
  CreateCommissionResponse,
  Commission,
  GetCommissionsRequest,
  GetCommissionsResponse
} from './types'
import { doActionWithError, formatTime } from 'npool-cli-v4'

export const useFrontendCommissionStore = defineStore('frontend-commission-v4', {
  state: () => ({
    Commissions: {
      Commissions: [] as Array<Commission>,
      Total: 0
    }
  }),
  getters: {
    settingDate () {
      return (commission: Commission) => {
        return formatTime(commission.StartAt, true)
      }
    },
    settingTime () {
      return (commission: Commission) => {
        return formatTime(commission.StartAt, false)?.split(' ')[1]
      }
    }
  },
  actions: {
    getCommissions (req: GetCommissionsRequest, done: (error: boolean, rows: Array<Commission>) => void) {
      doActionWithError<GetCommissionsRequest, GetCommissionsResponse>(
        API.GET_COMMISSIONS,
        req,
        req.Message,
        (resp: GetCommissionsResponse): void => {
          this.Commissions.Commissions.push(...resp.Infos)
          this.Commissions.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Commission>)
        }
      )
    },
    createCommission (req: CreateCommissionRequest, done: (error: boolean, row: Commission) => void) {
      doActionWithError<CreateCommissionRequest, CreateCommissionResponse>(
        API.CREATE_COMMISSION,
        req,
        req.Message,
        (resp: CreateCommissionResponse): void => {
          this.Commissions.Commissions.push(resp.Info)
          this.Commissions.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Commission)
        }
      )
    }
  }
})
