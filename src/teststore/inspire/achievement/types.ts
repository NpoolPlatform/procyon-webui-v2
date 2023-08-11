import { BaseRequest } from 'npool-cli-v4'
import { SettleAmountType, SettleInterval, SettleMode, SettleType } from '../commission'

export interface GoodAchievement {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  GoodID: string
  GoodName: string
  GoodUnit: string
  CommissionValue: string
  CommissionThreshold: string
  CommissionSettleType: SettleType
  CommissionSettleMode: SettleMode
  CommissionSettleAmountType: SettleAmountType
  CommissionSettleInterval: SettleInterval
  TotalUnits: string
  SelfUnits: string
  TotalAmount: string
  SelfAmount: string
  TotalCommission: string
  SelfCommission: string
  SuperiorCommission: string
}

export interface Achievement {
  UserID: string
  InviterID: string
  Username: string
  EmailAddress: string
  PhoneNO: string
  FirstName: string
  LastName: string
  CreatedAt: number
  InvitedAt: number
  Kol: boolean
  TotalInvitees: number
  Achievements: Array<GoodAchievement>
}

export interface GetAchievementsRequest extends BaseRequest {
  Offset: number
  Limit: number
}

export interface GetAchievementsResponse {
  Infos: Array<Achievement>
}
