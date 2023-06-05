import { AppCoin, CoinDescription, CoinCurrency, useAdminAppCoinStore, useAdminCoinDescriptionStore, useAdminCurrencyStore } from 'npool-cli-v4'

const coin = useAdminAppCoinStore()

export const getCoins = (offset: number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<AppCoin>) => {
    if (error || rows.length < limit) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

const description = useAdminCoinDescriptionStore()
export const getDescriptions = (offset: number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<CoinDescription>) => {
    if (error || rows.length < limit) {
      return
    }
    getDescriptions(offset + limit, limit)
  })
}

const currency = useAdminCurrencyStore()
export const getCurrencies = (offset: number, limit: number) => {
  currency.getCurrencies({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<CoinCurrency>) => {
    if (error || rows.length <= 0) {
      return
    }
    getCurrencies(offset + limit, limit)
  })
}
