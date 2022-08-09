import { BaseRequest } from 'npool-cli-v2'
interface Profit {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
}
interface GetProfitRequest extends BaseRequest {
  Offset?: number
  Limit?: number
  Key?: string
}
interface GetProfitResponse {
  Infos: Profit[]
  Total: number
}
interface GetIntervalProfitRequest extends BaseRequest {
  StartAt: number
  EndAt: number
  Offset?: number
  Limit?: number
}

interface GetIntervalProfitResponse {
  Infos: Profit[]
  Total: number
}

interface GoodProfit {
  GoodID: string
  GoodName: string
  GoodUnit: string
  Units: number
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
}
interface GetGoodProfitRequest extends BaseRequest {
  StartAt?: number
  EndAt?: number
  Offset?: number
  Limit?: number
  Key?: string
}
interface GetGoodProfitResponse {
  Infos: GoodProfit[]
  Total: number
}
interface GetIntervalGoodProfitRequest extends BaseRequest {
  StartAt?: number
  EndAt?: number
  Offset?: number
  Limit?: number
}
interface GetIntervalGoodProfitResponse {
  Infos: GoodProfit[]
  Total: number
}
export {
  Profit,
  GetProfitRequest,
  GetProfitResponse,
  GetIntervalProfitRequest,
  GetIntervalProfitResponse,
  GoodProfit,
  GetGoodProfitRequest,
  GetGoodProfitResponse,
  GetIntervalGoodProfitRequest,
  GetIntervalGoodProfitResponse
}
