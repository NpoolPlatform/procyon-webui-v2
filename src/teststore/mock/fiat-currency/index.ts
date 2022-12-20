import { defineStore } from 'pinia'
import { API, FiatCurrencyType } from './const'
import {
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
    getJPYCurrency () {
      return () => {
        const data = this.CoinFiatCurrencies.CoinFiatCurrencies.find((el) => el.FiatCurrencyName === FiatCurrencyType.JPY)
        return !data ? Number('') : Number(data.MarketValueHigh)
      }
    }
  },
  actions: {
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
