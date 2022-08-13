import { BaseRequest } from 'npool-cli-v2'
import { WithdrawState } from './const'

export enum IOType {
  Incoming = 'Incoming',
  Outcoming = 'Outcoming'
}

export enum IOSubType {
  Payment = 'Payment',
  MiningBenefit = 'MiningBenefit',
  Commission = 'Commission',
  TechniqueFeeCommission = 'TechniqueFeeCommission',
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal'
}

export interface Detail {
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  IOType: string;
  IOSubType: string;
  CreatedAt: number;
  Amount: string;
  IOExtra: string;
}
export interface GetDetailRequest extends BaseRequest {
  StartAt?: number;
  EndAt?: number;
  Offset: number;
  Limit: number;
}
export interface GetDetailResponse {
  Infos: Detail[];
  Total: number;
}
export interface Withdraw {
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  Amount: string;
  CreatedAt: number;
  Address: string;
  AddressLabels: string;
  State: WithdrawState;
  Message: string;
}

export interface GetWithdrawRequest extends BaseRequest {
  Offset: number;
  Limit: number;
}

export interface GetWithdrawResponse {
  Infos: Withdraw[];
  Total: number;
}

export interface CreateWithdrawRequest extends BaseRequest{
  CoinTypeID: string;
  AccountID: string;
  Amount: string;
  AccountType: string;
  Account: string;
  VerificationCode: string;
}

export interface CreateWithdrawResponse {
  Info: Withdraw;
}
