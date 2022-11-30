import { AppCoin, CoinDescription, useAdminAppCoinStore, useAdminCoinDescriptionStore } from 'npool-cli-v4'

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
