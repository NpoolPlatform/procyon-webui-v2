import { AppCoin, useAdminAppCoinStore } from 'npool-cli-v4'

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
