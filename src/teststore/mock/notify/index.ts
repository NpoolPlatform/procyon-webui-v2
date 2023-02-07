import { defineStore } from 'pinia'
import { API, EventType, Notif } from './const'
import { doActionWithError } from 'npool-cli-v4'
import {
  GetNotifRequest,
  GetNotifResponse,
  GetNotifsRequest,
  GetNotifsResponse,
  UpdateNotifsRequest,
  UpdateNotifsResponse
} from './types'

export const useFrontendNotifStore = defineStore('frontend-notif-v4', {
  state: () => ({
    Notifs: {
      Notifs: [] as Array<Notif>,
      Total: 0
    }
  }),
  getters: {
    getNotifByID (): (id: string) => Notif {
      return (id: string) => {
        const data = this.Notifs.Notifs.find((el) => el.ID === id)
        return !data ? {} as Notif : data
      }
    },
    unread () : Array<Notif> {
      return this.Notifs.Notifs.filter((el) => !el.AlreadyRead)
    },
    goWalletPage (): (row: Notif) => boolean {
      return (row: Notif) => {
        if (!row) {
          return false
        }
        return row.EventType === EventType.DepositReceived ||
              row.EventType === EventType.WithdrawalCompleted ||
              row.EventType === EventType.WithdrawalRequest
      }
    },
    goPersonPage (): (row: Notif) => boolean {
      return (row: Notif) => {
        if (!row) {
          return false
        }
        return row.EventType === EventType.KYCApproved ||
              row.EventType === EventType.KYCRejected
      }
    }
  },
  actions: {
    getNotifs (req: GetNotifsRequest, done: (rows: Array<Notif>, error: boolean) => void) {
      doActionWithError<GetNotifsRequest, GetNotifsResponse>(
        API.GET_NOTIFS,
        req,
        req.Message,
        (resp: GetNotifsResponse): void => {
          resp.Infos.forEach((el) => {
            const index = this.Notifs.Notifs.findIndex((al) => al.ID === el.ID)
            if (index === -1) {
              this.Notifs.Notifs.push(el)
            }
          })
          this.Notifs.Total = resp.Total
          done(resp.Infos, false)
        }, () => {
          done([], true)
        })
    },
    getNotif (req: GetNotifRequest, done: (row: Notif, error: boolean) => void) {
      doActionWithError<GetNotifRequest, GetNotifResponse>(
        API.GET_NOTIF,
        req,
        req.Message,
        (resp: GetNotifResponse): void => {
          done(resp.Info, false)
        }, () => {
          done({} as Notif, true)
        })
    },
    updateNotifs (req: UpdateNotifsRequest, done: (rows: Notif[], error: boolean) => void) {
      doActionWithError<UpdateNotifsRequest, UpdateNotifsResponse>(
        API.UPDATE_NOTIFS,
        req,
        req.Message,
        (resp: UpdateNotifsResponse): void => {
          resp.Infos.forEach((rl) => {
            const index = this.Notifs.Notifs.findIndex((el) => el.ID === rl.ID)
            this.Notifs.Notifs.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, rl)
          })
          done(resp.Infos, false)
        }, () => {
          done([] as Notif[], true)
        })
    }
  }
})
