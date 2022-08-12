import { Currency, useCoinStore, useCurrencyStore } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { General } from 'src/teststore/mock/ledger'
import { Profit } from 'src/teststore/mock/profit'
import { BalanceGeneral, CoinProfit } from './types'

export const useLocalLedgerStore = defineStore('localledger', {
  state: () => ({
    Generals: new Map<string, BalanceGeneral>(),
    CoinProfits: new Map<string, CoinProfit>()
  }),
  getters: {
    generals (): Array<BalanceGeneral> {
      return Array.from(this.Generals.values()).sort((a, b) => a.USDValue > b.USDValue ? -1 : 1)
    },
    toUsdtAmount (): number {
      let total = 0
      this.Generals.forEach((el) => { total += el.USDValue })
      return total
    },
    toJpyAmount (): number {
      let total = 0
      this.Generals.forEach((el) => { total += el.JPYValue })
      return total
    },
    toLastDayUsdtAmount (): number {
      let total = 0
      this.Generals.forEach((el) => { total += el.Last24HoursBalance })
      return total
    },

    toUsdtProfit (): number {
      let total = 0
      this.CoinProfits.forEach((el) => { total += el.USDAmount })
      return total
    },
    toLastDayUsdtProfit (): number {
      let total = 0
      this.CoinProfits.forEach((el) => { el.Last24HourUSDAmount ? total += el.Last24HourUSDAmount : total += 0 })
      return total
    }
  },
  actions: {
    initGeneral (generals: Array<General>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      this.Generals = new Map<string, BalanceGeneral>()
      generals.forEach((el) => {
        const g = {
          CoinTypeID: el.CoinTypeID,
          CoinName: el.CoinName,
          CoinLogo: el.CoinLogo,
          CoinUnit: el.CoinUnit,
          Balance: 0,
          Last24HoursBalance: 0,
          USDValue: 0,
          JPYValue: 0
        } as BalanceGeneral

        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            g.USDValue += Number(el.Spendable) * usdCurrency
            g.JPYValue += Number(el.Spendable) * jpyCurrency
            g.Balance += Number(el.Spendable)
            this.Generals.set(el.CoinTypeID, g)
          })
        })
      })
    },

    setLastDayGeneral (generals: Array<General> | undefined) {
      if (!generals) {
        return
      }
      generals.forEach((el) => {
        const g = this.Generals.get(el.CoinTypeID)
        if (!g) {
          return
        }
        g.Last24HoursBalance = Number(el.Incoming) - Number(el.Outcoming)
      })
    },

    initProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            if (!this.CoinProfits.get(el.CoinTypeID)) {
              this.CoinProfits.set(el.CoinTypeID, {
                Amount: Number(el.Incoming),
                USDAmount: Number(el.Incoming) * usdCurrency,
                JPYAmount: Number(el.Incoming) * jpyCurrency
              } as CoinProfit)
            } else {
              const cp = this.CoinProfits.get(el.CoinTypeID) as CoinProfit
              cp.USDAmount = Number(el.Incoming)
              cp.USDAmount = Number(el.Incoming) * usdCurrency
              cp.JPYAmount = Number(el.Incoming) * jpyCurrency
              this.CoinProfits.set(el.CoinTypeID, cp)
            }
          })
        })
      })
    },

    initLastDayProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            if (!this.CoinProfits.get(el.CoinTypeID)) {
              this.CoinProfits.set(el.CoinTypeID, {
                Last24HourAmount: Number(el.Incoming),
                Last24HourUSDAmount: Number(el.Incoming) * usdCurrency,
                Last24HourJPYAmount: Number(el.Incoming) * jpyCurrency
              } as CoinProfit)
            } else {
              const cp = this.CoinProfits.get(el.CoinTypeID) as CoinProfit
              cp.Last24HourAmount = Number(el.Incoming)
              cp.Last24HourUSDAmount = Number(el.Incoming) * usdCurrency
              cp.Last24HourJPYAmount = Number(el.Incoming) * jpyCurrency
              this.CoinProfits.set(el.CoinTypeID, cp)
            }
          })
        })
      })
    },

    initLastMonthProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            if (!this.CoinProfits.get(el.CoinTypeID)) {
              this.CoinProfits.set(el.CoinTypeID, {
                Last30DayAmount: Number(el.Incoming),
                Last30DayUSDAmount: Number(el.Incoming) * usdCurrency,
                Last30DayJPYAmount: Number(el.Incoming) * jpyCurrency
              } as CoinProfit)
            } else {
              const cp = this.CoinProfits.get(el.CoinTypeID) as CoinProfit
              cp.Last30DayAmount = Number(el.Incoming)
              cp.Last30DayUSDAmount = Number(el.Incoming) * usdCurrency
              cp.Last30DayJPYAmount = Number(el.Incoming) * jpyCurrency
              this.CoinProfits.set(el.CoinTypeID, cp)
            }
          })
        })
      })
    }
  }
})

export * from './types'
