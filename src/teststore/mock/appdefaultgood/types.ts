import { BaseRequest } from 'npool-cli-v4'

export interface AppDefaultGood {
  ID: string;
  AppID: string;
  GoodID: string;
  CoinTypeID: string;
  CoinUnit: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

export interface CreateAppDefaultGoodRequest extends BaseRequest {
  AppID?: string;
  GoodID: string;
  CoinTypeID: string;
}

export interface CreateAppDefaultGoodResponse {
  Info: AppDefaultGood;
}

export interface DeleteAppDefaultGoodRequest extends BaseRequest {
  ID: string;
  AppID?: string;
}

export interface DeleteAppDefaultGoodResponse {
  Info: AppDefaultGood;
}

export interface GetAppDefaultGoodsRequest extends BaseRequest {
  AppID?: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetAppDefaultGoodsResponse {
  Infos: AppDefaultGood[];
  /** @format int64 */
  Total: number;
}
