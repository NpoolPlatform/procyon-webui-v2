import { BaseRequest } from 'npool-cli-v4'

export interface FiatCurrencyType {
  ID: string;
  Name: string;
  Logo: string;
  /** @format int64 */
  CreatedAt: number;
  /** @format int64 */
  UpdatedAt: number;
}

/** @default "DefaultFeedType" */
export enum FeedType {
  DefaultFeedType = 'DefaultFeedType',
  CoinGecko = 'CoinGecko',
  CoinBase = 'CoinBase',
  StableUSDHardCode = 'StableUSDHardCode',
}

export interface FiatCurrency {
  /** @inject_tag: sql:"id" */
  ID: string;
  /** @inject_tag: sql:"fiat_currency_type_id" */
  FiatCurrencyTypeID: string;
  /** @inject_tag: sql:"feed_type" */
  FeedTypeStr: string;
  FeedType: FeedType;
  /** @inject_tag: sql:"fiat_currency_name" */
  FiatCurrencyName: string;
  /** @inject_tag: sql:"fiat_currency_name" */
  FiatCurrencyLogo: string;
  /** @inject_tag: sql:"market_value_high" */
  MarketValueHigh: string;
  /** @inject_tag: sql:"market_value_low" */
  MarketValueLow: string;
  /**
   * @inject_tag: sql:"created_at"
   * @format int64
   */
  CreatedAt: number;
  /**
   * @inject_tag: sql:"updated_at"
   * @format int64
   */
  UpdatedAt: number;
  /** @inject_tag: sql:"coin_type_id" */
  CoinTypeID: string;
  /** @inject_tag: sql:"coin_name" */
  CoinName: string;
  /** @inject_tag: sql:"coin_logo" */
  CoinLogo: string;
  /** @inject_tag: sql:"coin_unit" */
  CoinUnit: string;
  /** @inject_tag: sql:"coin_env" */
  CoinENV: string;
}

export interface CreateFiatCurrencyTypeRequest extends BaseRequest {
  Name: string;
}

export interface CreateFiatCurrencyTypeResponse {
  Info: FiatCurrencyType;
}

export interface GetFiatCurrencyTypesRequest extends BaseRequest {
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
}

export interface GetFiatCurrencyTypesResponse {
  Infos: FiatCurrencyType[];
  /** @format int64 */
  Total: number;
}

export interface UpdateFiatCurrencyTypeRequest extends BaseRequest {
  ID: string;
  Name: string;
}

export interface UpdateFiatCurrencyTypeResponse {
  Info: FiatCurrencyType;
}

export interface GetCoinFiatCurrenciesRequest extends BaseRequest {
  FiatCurrencyTypeIDs: string[];
  CoinTypeIDs: string[];
}

export interface GetCoinFiatCurrenciesResponse {
  Infos: FiatCurrency[];
  Total: number;
}

export interface GetHistoriesRequest extends BaseRequest {
  FiatCurrencyTypeID: string;
  /** @format int32 */
  Offset: number;
  /** @format int32 */
  Limit: number;
  /** @format int64 */
  StartAt: number;
  /** @format int64 */
  EndAt: number;
}

export interface GetHistoriesResponse {
  Infos: FiatCurrency[];
  /** @format int64 */
  Total: number;
}

export interface GetFiatCurrencyRequest extends BaseRequest {
  FiatCurrencyTypeName: string;
}

export interface GetFiatCurrencyResponse {
  Info: FiatCurrency;
}
