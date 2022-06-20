interface GoodItem {
  UserID: string
  GoodID: string
  Editing: boolean
  Percent: number
}

interface GoodState {
  Goods: Array<GoodItem>
}

export {
  GoodState,
  GoodItem
}
