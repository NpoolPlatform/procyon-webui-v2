interface GoodItem {
  UserID: string
  GoodID: string
  Editing: boolean
  Percent: number
}

interface GoodState {
  Goods: Array<GoodItem>
}

interface GoodGeneral{
  GoodID: string
  GoodName: string
  GoodUnit: string
  GoodServicePeriodDays: number
  Units: number
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  CoinPresale: boolean
  Incoming: string
  Last24HoursIncoming: number
}
export {
  GoodState,
  GoodItem,
  GoodGeneral
}
