import { appcoin, appcoindescription, coincurrency, coincurrencybase } from 'src/npoolstore'

const coin = appcoin.useAppCoinStore()

export const getCoins = (offset: number, limit: number, done?: () => void) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<appcoin.AppCoin>) => {
    if (error || !rows?.length) {
      if (!error) done?.()
      return
    }
    getCoins(offset + limit, limit, done)
  })
}

const description = appcoindescription.useCoinDescriptionStore()
export const getDescriptions = (offset: number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows?: Array<appcoindescription.CoinDescription>) => {
    if (error || !rows?.length) {
      return
    }
    getDescriptions(offset + limit, limit)
  })
}

const currency = coincurrency.useCurrencyStore()
export const getCurrencies = (offset: number, limit: number) => {
  currency.getCurrencies({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<coincurrencybase.CoinCurrency>) => {
    if (error || rows.length <= 0) {
      return
    }
    getCurrencies(offset + limit, limit)
  })
}
