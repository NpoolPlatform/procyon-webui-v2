import { useCoinStore, useCurrencyStore } from 'npool-cli-v2'
import { defineStore } from 'pinia'
export const useLocalCoinStore = defineStore('localcoin', {
  state: () => ({}),
  getters: {
    formatCoinName: () => (coinTypeID:string) => {
      if (!coinTypeID) {
        return ''
      }
      const coin = useCoinStore()
      const existingCoin = coin.Coins.find((el) => el.ID === coinTypeID)
      if (!existingCoin) {
        return ''
      }
      const currencies = useCurrencyStore()
      if (existingCoin.ENV === 'test') {
        return currencies.formatCoinName(existingCoin.Name as string)
      }
      if (existingCoin.Name?.toLowerCase()?.includes('bitcoin')) {
        return 'BTC (Bitcoin)'
      } else if (existingCoin.Name?.toLowerCase()?.includes('binanceusd')) {
        return 'BUSD (BEP20)'
      } else if (existingCoin.Name?.toLowerCase()?.includes('usdcerc20')) {
        return 'USDC (ERC20)'
      } else if (existingCoin.Name?.toLowerCase()?.includes('usdterc20')) {
        return 'USDT (ERC20)'
      } else if (existingCoin.Name?.toLowerCase()?.includes('usdttrc20')) {
        return 'USDT (TRC20)'
      }
      return currencies.formatCoinName(existingCoin.Name as string)
    }
  },
  actions: {}
})
