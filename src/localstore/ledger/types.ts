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

export {
  BalanceGeneral
}
