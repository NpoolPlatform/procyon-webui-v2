import { BaseRequest } from 'npool-cli-v2'

interface Profit {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  Incoming: string
}

interface IntervalProfits {
  Profits: Array<Profit>
  Total: number
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
  GoodServicePeriodDays: number
  Units: number
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  CoinPresale: boolean
  Incoming: string
}

interface IntervalGoodProfits {
  Profits: Array<GoodProfit>
  Total: number
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

export {
  Profit,
  IntervalProfits,
  GetProfitRequest,
  GetProfitResponse,
  GetIntervalProfitRequest,
  GetIntervalProfitResponse,
  GoodProfit,
  IntervalGoodProfits,
  GetGoodProfitRequest,
  GetGoodProfitResponse
}
