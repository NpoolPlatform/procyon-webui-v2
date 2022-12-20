import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetFiatCurrencyTypesRequest,
  GetFiatCurrencyTypesResponse,
  UpdateFiatCurrencyTypeRequest,
  UpdateFiatCurrencyTypeResponse,
  FiatCurrencyType,
  CreateFiatCurrencyTypeRequest,
  CreateFiatCurrencyTypeResponse,
  FiatCurrency,
  GetCoinFiatCurrenciesRequest,
  GetCoinFiatCurrenciesResponse,
  GetHistoriesRequest,
  GetHistoriesResponse,
  GetFiatCurrencyRequest,
  GetFiatCurrencyResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminFiatCurrencyStore = defineStore('admin-fiatcurrency-v4', {
  state: () => ({
    FiatCurrencyTypes: {
      FiatCurrencyTypes: [] as Array<FiatCurrencyType>,
      Total: 0
    },
    CoinFiatCurrencies: {
      CoinFiatCurrencies: [] as Array<FiatCurrency>,
      Total: 0
    },
    Histories: {
      Histories: [] as Array<FiatCurrency>,
      Total: 0
    }
  }),
  getters: {
    getFiatCurrencyTypeByName () {
      return (name: string) => {
        return this.FiatCurrencyTypes.FiatCurrencyTypes.find((el) => el.Name === name)
      }
    },
    getJYPCurrency () {
      return () => {
        const data = this.CoinFiatCurrencies.CoinFiatCurrencies.find((el) => el.FiatCurrencyName === 'name')
        return !data ? '' : data.MarketValueHigh
      }
    }
  },
  actions: {
    getFiatCurrencyTypes (req: GetFiatCurrencyTypesRequest, done: (error: boolean, rows: Array<FiatCurrencyType>) => void) {
      doActionWithError<GetFiatCurrencyTypesRequest, GetFiatCurrencyTypesResponse>(
        API.GET_FIATCURRENCYTYPES,
        req,
        req.Message,
        (resp: GetFiatCurrencyTypesResponse): void => {
          this.FiatCurrencyTypes.FiatCurrencyTypes.push(...resp.Infos)
          this.FiatCurrencyTypes.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<FiatCurrencyType>)
        }
      )
    },
    updateFiatCurrencyType (req: UpdateFiatCurrencyTypeRequest, done: (error: boolean, row: FiatCurrencyType) => void) {
      doActionWithError<UpdateFiatCurrencyTypeRequest, UpdateFiatCurrencyTypeResponse>(
        API.UPDATE_FIATCURRENCYTYPE,
        req,
        req.Message,
        (resp: UpdateFiatCurrencyTypeResponse): void => {
          const index = this.FiatCurrencyTypes.FiatCurrencyTypes.findIndex((el) => el.ID === resp.Info.ID)
          this.FiatCurrencyTypes.FiatCurrencyTypes.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as FiatCurrencyType)
        }
      )
    },
    createFiatCurrencyType (req: CreateFiatCurrencyTypeRequest, done: (error: boolean, row: FiatCurrencyType) => void) {
      doActionWithError<CreateFiatCurrencyTypeRequest, CreateFiatCurrencyTypeResponse>(
        API.CREATE_FIATCURRENCYTYPE,
        req,
        req.Message,
        (resp: CreateFiatCurrencyTypeResponse): void => {
          this.FiatCurrencyTypes.FiatCurrencyTypes.push(resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as FiatCurrencyType)
        }
      )
    },
    getCoinFiatCurrencies (req: GetCoinFiatCurrenciesRequest, done: (error: boolean, rows: Array<FiatCurrency>) => void) {
      doActionWithError<GetCoinFiatCurrenciesRequest, GetCoinFiatCurrenciesResponse>(
        API.GET_COINFIATCURRENCIES,
        req,
        req.Message,
        (resp: GetCoinFiatCurrenciesResponse): void => {
          this.CoinFiatCurrencies.CoinFiatCurrencies.push(...resp.Infos)
          this.CoinFiatCurrencies.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<FiatCurrency>)
        }
      )
    },
    getFiatCurrencyHistories (req: GetHistoriesRequest, done: (error: boolean, rows: Array<FiatCurrency>) => void) {
      doActionWithError<GetHistoriesRequest, GetHistoriesResponse>(
        API.GET_HISTORIES,
        req,
        req.Message,
        (resp: GetHistoriesResponse): void => {
          this.Histories.Histories.push(...resp.Infos)
          this.Histories.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<FiatCurrency>)
        }
      )
    },
    getFiatCurrency (req: GetFiatCurrencyRequest, done: (error: boolean, rows: FiatCurrency) => void) {
      doActionWithError<GetFiatCurrencyRequest, GetFiatCurrencyResponse>(
        API.GET_FIATCURRENCY,
        req,
        req.Message,
        (resp: GetFiatCurrencyResponse): void => {
          this.CoinFiatCurrencies.CoinFiatCurrencies.push(resp.Info)
          this.CoinFiatCurrencies.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as FiatCurrency)
        }
      )
    }
  }
})
