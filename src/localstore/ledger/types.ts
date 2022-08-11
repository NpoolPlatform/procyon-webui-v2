interface BalanceGeneral{
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Balance: number
  Last24HoursBalance: number
  USDValue: number
  JPYValue: number
}

interface TotalProfit {
  USDAmount: number
  JPYAmount: number
  Last24HourUSDAmount: number
  Last24HourJPYAmount: number
}

export {
  BalanceGeneral,
  TotalProfit
}
