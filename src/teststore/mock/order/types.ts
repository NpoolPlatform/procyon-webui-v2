import { BaseRequest } from 'npool-cli-v2'

interface LocalOrder {
  ID: string;
  ParentOrderID: string;
  ParentOrderGoodID: string;
  ParentOrderGoodName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  GoodID: string;
  GoodName: string;
  GoodUnit: string;
  Units: number;
  PaymentID: string;
  PaymentCoinTypeID: string;
  PaymentCoinName: string;
  PaymentCoinLogo: string;
  PaymentCoinUnit: string;
  PaymentCoinUSDCurrency: string;
  PaymentLiveUSDCurrency: string;
  PaymentLocalUSDCurrency: string;
  PaymentAddress: string;
  PaymentAmount: string;
  PayWithBalanceAmount: string;
  PayWithParent: boolean;
  FixAmountID: string;
  FixAmountName: string;
  FixAmountAmount: string;
  DiscountID: string;
  DiscountName: string;
  DiscountPercent: number;
  SpecialOfferID: string;
  SpecialOfferAmount: string;
  CreatedAt: number;
  PaidAt: number;
  State: string;
  OrderType: string;
  Start: number;
  End: number;
}
interface GetOrderRequest extends BaseRequest {
  Offset?: number;
  Limit?: number;
}
interface GetOrderResponse {
  Infos: LocalOrder[];
  Total: number;
}
interface CreateOrderRequest extends BaseRequest {
  GoodID: string;
  Units: number;
  PaymentCoinID: string;
  ParentOrderID?: string;
  PayWithBalanceAmount?: string;
  FixAmountID?: string;
  DiscountID?: string;
  SpecialOfferID?: string;
  OrderType?: string;
}
interface CreateOrderResponse {
  Info: LocalOrder;
}
interface UpdateOrderRequest extends BaseRequest {
  ID: string;
  PaymentID: string;
  Canceled: boolean;
}
interface UpdateOrderResponse {
  Info: LocalOrder;
}
interface GetSingleOrderRequest extends BaseRequest {
  ID: string;
}
interface GetSingleOrderResponse {
  Info: LocalOrder;
}
export {
  LocalOrder,
  GetOrderRequest,
  GetOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  GetSingleOrderRequest,
  GetSingleOrderResponse
}
