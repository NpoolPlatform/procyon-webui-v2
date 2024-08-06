import { achievement, ledgerprofit } from 'src/npoolstore'

export interface MyGoodProfit extends ledgerprofit.GoodProfit {
  GoodSaleEndAt: number
  CoinPreSale: boolean
  TotalInComing: number
  TotalUSDInComing: number
  Last24HoursInComing: number
  Last24HoursUSDInComing: number
  Last30DaysInComing: number
  Last30DaysUSDInComing: number
  MiningStartDate: string
  DaysMined: number
  DaysRemaining: number
  ServicePeriod: number
}

export interface MyGoodAchievement extends achievement.GoodAchievement {
  Editing: boolean
}
export interface MyAchievement extends achievement.Achievement {
  Achievements: MyGoodAchievement[]
}
