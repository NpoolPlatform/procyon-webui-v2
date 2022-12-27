import { BaseRequest, MyRequest } from 'npool-cli-v4'

export interface Message {
  ID: string;
  AppName: string;
  LangID: string;
  Lang: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
  CreatedAt: number;
  UpdatedAt: number;
}

export interface MessageReq {
  ID: string;
  AppID: string;
  LangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
}

export interface CreateMessageRequest extends MyRequest {
  TargetLangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
}

export interface CreateMessageResponse {
  Info: Message;
}

export interface CreateMessagesRequest extends BaseRequest {
  // AppID: string;
  TargetLangID: string;
  Infos: MessageReq[];
}

export interface CreateMessagesResponse {
  Infos: Message[];
}

export interface DeleteMessageRequest extends MyRequest {
  ID: string;
}

export interface DeleteMessageResponse {
  Info: Message;
}

export interface GetMessagesRequest extends MyRequest {
  LangID: string;
  Disabled: boolean;
  Offset: number;
  Limit: number;
}

export interface GetMessagesResponse {
  Infos: Message[];
  Total: number;
}

export interface UpdateMessageRequest extends MyRequest {
  ID: string;
  // AppID: string;
  // LangID: string;
  MessageID: string;
  Message: string;
  GetIndex: number;
  Disabled: boolean;
}

export interface UpdateMessageResponse {
  Info: Message;
}
