import { BaseRequest } from 'npool-cli-v2'

export interface General {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
  Locked: string
  Outcoming: string
  Spendable: string
}
export interface GetGeneralRequest extends BaseRequest {
  Offset: number
  Limit: number
}
export interface GetGeneralResponse {
  Infos: General[]
  Total: number
}
export interface GetIntervalGeneralRequest extends BaseRequest {
  StartAt: number
  EndAt: number
  Offset: number
  Limit: number
}
export interface GetIntervalGeneralResponse {
  Infos: General[];
  Total: number;
}
