import { useCurrencyStore } from 'npool-cli-v2'
import { defineStore } from 'pinia'
export const useLocalCoinStore = defineStore('localcoin', {
  state: () => ({}),
  getters: {
    formatCoinName: () => (coinName:string|undefined) => {
      if (coinName === undefined) {
        return ''
      }
      const currencies = useCurrencyStore()
      if (coinName?.toLowerCase()?.includes('bitcoin')) {
        return 'BTC (Bitcoin)'
      } else if (coinName?.toLowerCase()?.includes('binanceusd')) {
        return 'BUSD (BEP20)'
      } else if (coinName?.toLowerCase()?.includes('usdcerc20')) {
        return 'USDC (ERC20)'
      } else if (coinName?.toLowerCase()?.includes('usdterc20')) {
        return 'USDT (ERC20)'
      } else if (coinName?.toLowerCase()?.includes('usdttrc20')) {
        return 'USDT (TRC20)'
      }
      return currencies.formatCoinName(coinName)
    }
  },
  actions: {}
})
