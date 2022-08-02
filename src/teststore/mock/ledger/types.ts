import { BaseRequest } from 'npool-cli-v2'

export interface Detail {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  IOType: string
  IOSubType: string
  Amount: string
  IOExtra: string
}
export interface GetDetailRequest extends BaseRequest {
  StartAt: number
  EndAt: number
  Offset: number
  Limit: number
}
export interface GetDetailResponse {
  Infos: Detail[]
  Total: number
}

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

export interface Profit {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
}
export interface GetProfitRequest extends BaseRequest {
  Offset: number
  Limit: number
}
export interface GetProfitResponse {
  Infos: Profit[]
}
export interface GetIntervalProfitRequest extends BaseRequest {
  StartAt: number
  EndAt: number
  Offset: number
  Limit: number
}
export interface GetIntervalProfitResponse {
  Infos: Profit[];
  Total: number;
}
