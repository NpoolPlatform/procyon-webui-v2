import { defineStore } from 'pinia'
import { API, EventType, Notif } from './const'
import { doActionWithError } from 'npool-cli-v4'
import {
  GetNotifRequest,
  GetNotifResponse,
  GetNotifsRequest,
  GetNotifsResponse
} from './types'

export const useFrontendNotifStore = defineStore('frontend-notif-v4', {
  state: () => ({
    Notifs: {
      Notifs: [] as Array<Notif>,
      Total: 0
    }
  }),
  getters: {
    getNotifByID (): (ID:string) => Notif {
      return (ID: string) => {
        const data = this.Notifs.Notifs.find((el) => el.ID === ID)
        return !data ? {} as Notif : data
      }
    },
    getNotifsByName (): (name: string) => Array<Notif> {
      return (name: string) => this.Notifs.Notifs.filter((el) => el.ID?.toLowerCase()?.includes(name.toLowerCase()) ||
                                                            el.EmailAddress?.toLowerCase()?.includes(name.toLowerCase()) ||
                                                            el.PhoneNO?.toLowerCase()?.includes(name.toLocaleLowerCase()))
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
          this.Notifs.Notifs.push(...resp.Infos)
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
    }
  }
})
