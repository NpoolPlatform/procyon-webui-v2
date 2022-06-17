interface GoodItem {
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
