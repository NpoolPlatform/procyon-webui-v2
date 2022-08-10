import { Currency, useCoinStore, useCurrencyStore } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { IntervalKey } from 'src/const/const'
import { General, useGeneralStore } from 'src/teststore/mock/ledger'
import { BalanceGeneral } from './types'

export const useLocalLedgerStore = defineStore('localledger', {
  state: () => ({
    Generals: [] as Array<BalanceGeneral>
  }),
  getters: {},
  actions: {
    initialize (generals: Array<General>) {
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
    }
  }
})

export * from './types'
