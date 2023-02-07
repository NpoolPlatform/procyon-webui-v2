import { BaseRequest } from 'npool-cli-v4'
import { Notif } from './const'

export interface GetNotifRequest extends BaseRequest{
  ID: string;
}

export interface GetNotifResponse {
  Info: Notif;
}

export interface UpdateNotifRequest extends BaseRequest{
  IDs: string[];
  AlreadyRead: boolean;
}

export interface UpdateNotifResponse {
  Info: Notif;
}
export interface GetNotifsRequest extends BaseRequest {
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNotifsResponse {
  Infos: Notif[];
  /** @format int64 */
  Total: number;
}

export interface GetAppUserNotifsRequest extends BaseRequest {
  TargetAppID: string;
  TargetUserID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppUserNotifsResponse {
  Infos: Notif[];
  /** @format int64 */
  Total: number;
}
