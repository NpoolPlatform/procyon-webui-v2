import { Currency, useCoinStore, useCurrencyStore } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { IntervalKey } from 'src/const/const'
import { General, useGeneralStore } from 'src/teststore/mock/ledger'
import { Profit } from 'src/teststore/mock/profit'
import { BalanceGeneral, TotalProfit, CoinProfit } from './types'

export const useLocalLedgerStore = defineStore('localledger', {
  state: () => ({
    Generals: [] as Array<BalanceGeneral>,
    Profit: {} as TotalProfit,
    CoinProfits: [] as Array<CoinProfit>
  }),
  getters: {},
  actions: {
    initGeneral (generals: Array<General>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      this.Generals = [] as Array<BalanceGeneral>
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
            this.Generals.push(g)
          })
        })
      })
      // last24hours incoming
      const general = useGeneralStore()
      const igenerals = general.IntervalGenerals.get(IntervalKey.LastDay)
      this.Generals.forEach((el) => {
        igenerals?.Generals.filter((il) => il.CoinTypeID === el.CoinTypeID).forEach((il) => {
          el.Last24HoursBalance += Number(il.Incoming)
        })
      })
    },

    setLastDayGeneral (generals: Array<General> | undefined) {
      if (!generals) {
        return
      }
      generals.forEach((el) => {
        const g = this.Generals.find((gel) => gel.CoinTypeID === el.CoinTypeID)
        if (!g) {
          return
        }
        g.Last24HoursBalance += Number(el.Incoming) - Number(el.Outcoming)
      })
    },

    initProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      this.Profit.USDAmount = 0
      this.Profit.JPYAmount = 0

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            this.Profit.USDAmount += Number(el.Incoming) * usdCurrency
            this.Profit.JPYAmount += Number(el.Incoming) * jpyCurrency

            const index = this.CoinProfits.findIndex((pel) => pel.CoinTypeID === el.CoinTypeID)
            let pel = this.CoinProfits[index]
            if (index < 0) {
              pel = {
                Amount: 0,
                USDAmount: 0
              } as CoinProfit
            }
            pel.Amount += Number(el.Incoming)
            pel.USDAmount += Number(el.Incoming) * usdCurrency
            this.CoinProfits.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, pel)
          })
        })
      })
    },

    initLastDayProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      this.Profit.Last24HourJPYAmount = 0
      this.Profit.Last24HourUSDAmount = 0

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            this.Profit.Last24HourUSDAmount += Number(el.Incoming) * usdCurrency
            this.Profit.Last24HourJPYAmount += Number(el.Incoming) * jpyCurrency

            const index = this.CoinProfits.findIndex((pel) => pel.CoinTypeID === el.CoinTypeID)
            let pel = this.CoinProfits[index]
            if (index < 0) {
              pel = {
                Last24HourAmount: 0,
                Last24HourUSDAmount: 0
              } as CoinProfit
            }
            pel.Last24HourAmount += Number(el.Incoming)
            pel.Last24HourUSDAmount += Number(el.Incoming) * usdCurrency
            this.CoinProfits.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, pel)
          })
        })
      })
    },

    initLastMonthProfit (profits: Array<Profit>) {
      const currencies = useCurrencyStore()
      const coin = useCoinStore()

      this.Profit.Last30DayJPYAmount = 0
      this.Profit.Last30DayUSDAmount = 0

      profits.forEach((el) => {
        currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.USD, (usdCurrency: number) => {
          currencies.getCoinCurrency(coin.getCoinByID(el.CoinTypeID), Currency.JPY, (jpyCurrency: number) => {
            this.Profit.Last30DayUSDAmount += Number(el.Incoming) * usdCurrency
            this.Profit.Last30DayJPYAmount += Number(el.Incoming) * jpyCurrency

            const index = this.CoinProfits.findIndex((pel) => pel.CoinTypeID === el.CoinTypeID)
            let pel = this.CoinProfits[index]
            if (index < 0) {
              pel = {
                Last30DayAmount: 0,
                Last30DayUSDAmount: 0
              } as CoinProfit
            }
            pel.Last30DayAmount += Number(el.Incoming)
            pel.Last30DayUSDAmount += Number(el.Incoming) * usdCurrency
            this.CoinProfits.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, pel)
          })
        })
      })
    }
  }
})

export * from './types'
