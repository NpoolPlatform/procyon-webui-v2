import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppCountriesRequest,
  GetAppCountriesResponse,
  AppCountry
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminAppCountryStore = defineStore('admin-appcountry-v4', {
  state: () => ({
    AppCountries: {
      AppCountries: [] as Array<AppCountry>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getAppCountries (req: GetAppCountriesRequest, done: (error: boolean, rows: Array<AppCountry>) => void) {
      doActionWithError<GetAppCountriesRequest, GetAppCountriesResponse>(
        API.GET_APPCOUNTRIES,
        req,
        req.Message,
        (resp: GetAppCountriesResponse): void => {
          this.AppCountries.AppCountries.push(...resp.Infos)
          this.AppCountries.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    }
  }
})
