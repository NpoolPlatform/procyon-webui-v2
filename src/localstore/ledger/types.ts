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
  Last30DayUSDAmount: number
  Last30DayJPYAmount: number
}

interface CoinProfit {
  CoinTypeID: string
  Amount: number
  USDAmount: number
  Last24HourAmount: number
  Last24HourUSDAmount: number
  Last30DayAmount: number
  Last30DayUSDAmount: number
}

export {
  BalanceGeneral,
  TotalProfit,
  CoinProfit
}
