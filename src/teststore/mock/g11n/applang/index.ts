import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppLangsRequest,
  GetAppLangsResponse,
  AppLang,
  UpdateAppLangRequest,
  UpdateAppLangResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'
import { useLocalLangStore } from 'src/localstore/lang'

export const useAdminAppLangStore = defineStore('admin-applang-v4', {
  state: () => ({
    AppLangs: {
      AppLangs: [] as Array<AppLang>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppLangs (req: GetAppLangsRequest, done: (error: boolean, rows: Array<AppLang>) => void) {
      doActionWithError<GetAppLangsRequest, GetAppLangsResponse>(
        API.GET_APPLANGS,
        req,
        req.Message,
        (resp: GetAppLangsResponse): void => {
          this.AppLangs.AppLangs.push(...resp.Infos)
          this.AppLangs.Total = resp.Total

          const locale = useLocalLangStore()
          locale.setLangs(this.AppLangs.AppLangs)
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    },
    updateAppLang (req: UpdateAppLangRequest, done: (error: boolean, row: AppLang) => void) {
      doActionWithError<UpdateAppLangRequest, UpdateAppLangResponse>(
        API.UPDATE_APPLANG,
        req,
        req.Message,
        (resp: UpdateAppLangResponse): void => {
          const index = this.AppLangs.AppLangs.findIndex((el) => el.ID === resp.Info.ID)
          this.AppLangs.AppLangs.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as AppLang)
        }
      )
    }
  }
})
