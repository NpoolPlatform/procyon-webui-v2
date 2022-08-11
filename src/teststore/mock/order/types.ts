import { BaseRequest } from 'npool-cli-v2'

interface Order {
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
  GoodServicePeriodDays: number,
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

interface GetOrdersRequest extends BaseRequest {
  Offset?: number;
  Limit?: number;
}

interface GetOrdersResponse {
  Infos: Array<Order>;
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
  Info: Order;
}

interface UpdateOrderRequest extends BaseRequest {
  ID: string;
  PaymentID: string;
  Canceled: boolean;
}

interface UpdateOrderResponse {
  Info: Order;
}

interface GetOrderRequest extends BaseRequest {
  ID: string;
}

interface GetOrderResponse {
  Info: Order;
}

export {
  Order,
  GetOrderRequest,
  GetOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse
}
