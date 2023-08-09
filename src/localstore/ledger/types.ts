import { GoodProfit } from 'npool-cli-v4'
import { achievement } from 'src/teststore'

export interface MyGoodProfit extends GoodProfit {
  GoodSaleEndAt: number
  CoinPreSale: boolean
  TotalInComing: number
  TotalUSDInComing: number
  Last24HoursInComing: number
  Last24HoursUSDInComing: number
  Last30DaysInComing: number
  Last30DaysUSDInComing: number
  TotalEstimatedDailyReward: number
  MiningStartDate: string
  DaysMined: number
  DaysRemaining: number
}

export interface MyGoodAchievement extends achievement.GoodAchievement {
  Editing: boolean
}
export interface MyAchievement extends achievement.Achievement {
  Achievements: MyGoodAchievement[]
}
