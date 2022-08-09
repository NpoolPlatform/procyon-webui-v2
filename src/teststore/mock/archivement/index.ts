import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  ProductArchivement,
  GetArchivementRequest,
  GetArchivementResponse
} from './types'

export const useArchivementStore = defineStore('archivement', {
  state: () => ({
    Archivements: {
      Archivements: [] as Array<ProductArchivement>,
      Total: 0
    }
  }),
  getters: {},
  actions: {
    getCoinArchivements (req: GetArchivementRequest, done: (error: boolean) => void) {
      doActionWithError<GetArchivementRequest, GetArchivementResponse>(
        API.GET_COIN_ARCHIVEMENTS,
        req,
        req.Message,
        (resp: GetArchivementResponse): void => {
          this.Archivements.Archivements.push(...resp.Archivements)
          this.Archivements.Total = resp.Total
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
