import { BaseRequest } from 'npool-cli-v4'

export interface AppLang {
  ID: string;
  AppID: string;
  AppName: string;
  LangID: string;
  Lang: string;
  Logo: string;
  Name: string;
  Short: string;
  Main: boolean;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface UpdateAppLangRequest extends BaseRequest {
  ID: string;
  Main: boolean;
}

export interface UpdateAppLangResponse {
  Info: AppLang;
}

export interface GetAppLangsRequest extends BaseRequest {
  LangID?: string;
  Offset: number;
  Limit: number;
}

export interface GetAppLangsResponse {
  Infos: AppLang[];
  Total: number;
}
