import { BaseRequest } from 'npool-cli-v4'

export enum SettleType {
  GoodOrderPayment = 'GoodOrderPayment',
  TechniqueServiceFee = 'TechniqueServiceFee',
  NoCommission = 'NoCommission'
}
export const SettleTypes = Object.values(SettleType)

export enum SettleMode {
  SettleWithGoodValue = 'SettleWithGoodValue',
  SettleWithPaymentAmount = 'SettleWithPaymentAmount'
}
export const SettleModes = Object.values(SettleMode)

export enum SettleAmountType {
  SettleByPercent = 'SettleByPercent',
  SettleByAmount = 'SettleByAmount'
}
export const SettleAmountTypes = Object.values(SettleAmountType)

export enum SettleInterval {
  SettleAggregate = 'SettleAggregate',
  SettleMonthly = 'SettleMonthly',
  SettleYearly = 'SettleYearly',
  SettleEveryOrder = 'SettleEveryOrder'
}
export const SettleIntervals = Object.values(SettleInterval)

export interface Commission {
  ID: string
  AppID: string
  UserID: string
  Username: string
  EmailAddress: string
  PhoneNO: string
  FirstName: string
  LastName: string
  Kol: boolean
  SettleType: SettleType
  SettleMode: SettleMode
  SettleInterval: SettleInterval
  SettleAmountType: SettleAmountType
  GoodID: string
  GoodName: string
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  AmountOrPercent: string
  Threshold: string
  /** @format int64 */
  StartAt: number
  /** @format int64 */
  EndAt: number
  /** @format int64 */
  CreatedAt: number
  /** @format int64 */
  UpdatedAt: number
}

export interface CreateCommissionRequest extends BaseRequest {
  TargetUserID: string
  GoodID: string
  SettleType: SettleType
  SettleAmountType: SettleAmountType
  AmountOrPercent: string
  StartAt: number
  SettleMode: SettleMode
  Threshold?: string
  SettleInterval: SettleInterval
}

export interface CreateCommissionResponse {
  Info: Commission
}

export interface GetCommissionsRequest extends BaseRequest {
  /** @format int32 */
  Offset: number
  /** @format int32 */
  Limit: number
}

export interface GetCommissionsResponse {
  Infos: Commission[]
  /** @format int64 */
  Total: number
}
