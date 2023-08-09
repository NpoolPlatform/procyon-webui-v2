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

export const useCommissionStore = defineStore('commission', {
  state: () => ({
    Commissions: [] as Array<Commission>
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
    getCommissions (req: GetCommissionsRequest, done: (error: boolean, rows?: Array<Commission>) => void) {
      doActionWithError<GetCommissionsRequest, GetCommissionsResponse>(
        API.GET_COMMISSIONS,
        req,
        req.Message,
        (resp: GetCommissionsResponse): void => {
          this.Commissions.push(...resp.Infos)
          done(false, resp.Infos)
        }, () => {
          done(true)
        }
      )
    },
    createCommission (req: CreateCommissionRequest, done: (error: boolean, row?: Commission) => void) {
      doActionWithError<CreateCommissionRequest, CreateCommissionResponse>(
        API.CREATE_COMMISSION,
        req,
        req.Message,
        (resp: CreateCommissionResponse): void => {
          this.Commissions.push(resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
