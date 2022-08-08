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
  Units: number
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
  Last24Hours: number
}
export {
  GoodState,
  GoodItem,
  GoodGeneral
}
