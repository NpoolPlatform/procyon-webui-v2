import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  ProductArchivement,
  GetArchivementRequest,
  GetArchivementResponse
} from './types'

export const useArchivementStore = defineStore('archivement', {
  state: (): GetArchivementResponse => ({
    Archivements: [] as Array<ProductArchivement>,
    Total: 0
  }),
  getters: {},
  actions: {
    getCoinArchivements (req: GetArchivementRequest, done: (error: boolean) => void) {
      doActionWithError<GetArchivementRequest, GetArchivementResponse>(
        API.GET_COIN_ARCHIVEMENT,
        req,
        req.Message,
        (resp: GetArchivementResponse): void => {
          resp.Archivements.forEach((el) => {
            this.Archivements.push(el)
          })
          this.Total = resp.Total
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
