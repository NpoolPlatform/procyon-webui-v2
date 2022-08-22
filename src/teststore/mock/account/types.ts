import { BaseRequest } from 'npool-cli-v2/.'
import { AccountUsedFor } from './state'

interface Account {
  ID: string;
  AppID: string;
  UserID: string;
  CoinTypeID: string;
  CoinName: string;
  CoinUnit: string;
  CoinEnv: string;
  CoinLogo: string;
  AccountID: string;
  Address: string;
  UsedFor: string;
  Labels: string[];
  CreatedAt: number;
}
interface CreateAccountRequest extends BaseRequest {
  CoinTypeID: string;
  UsedFor: AccountUsedFor;
  Address?: string;
  Labels?: string[];
}
interface CreateAccountResponse {
  Info: Account;
}
interface GetUserAccountsRequest extends BaseRequest{
  UsedFor: AccountUsedFor;
  Offset?: number;
  Limit?: number;
}
interface GetUserAccountsResponse {
  Infos: Array<Account>;
  Total: number;
}
interface GetDepositAccountRequest extends BaseRequest{
  CoinTypeID: string;
}
interface GetDepositAccountResponse {
  Info: Account;
}
export {
  Account,
  CreateAccountRequest,
  CreateAccountResponse,
  GetUserAccountsRequest,
  GetUserAccountsResponse,
  GetDepositAccountRequest,
  GetDepositAccountResponse
}
