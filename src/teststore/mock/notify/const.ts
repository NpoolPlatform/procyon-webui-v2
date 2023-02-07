/** @default "DefaultEventType" */
export enum EventType {
  DefaultEventType = 'DefaultEventType',
  WithdrawalRequest = 'WithdrawalRequest',
  WithdrawalCompleted = 'WithdrawalCompleted',
  DepositReceived = 'DepositReceived',
  KYCApproved = 'KYCApproved',
  KYCRejected = 'KYCRejected',
}

export const EventTypes = [
  EventType.WithdrawalRequest,
  EventType.WithdrawalCompleted,
  EventType.DepositReceived,
  EventType.KYCApproved,
  EventType.KYCRejected
]

/** @default "DefaultChannel" */
export enum NotifChannel {
  DefaultChannel = 'DefaultChannel',
  ChannelEmail = 'ChannelEmail',
  ChannelSMS = 'ChannelSMS',
}

export interface Notif {
  ID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  EventType: EventType;
  UseTemplate: boolean;
  Title: string;
  Content: string;
  Channels: NotifChannel[];
  AlreadyRead: boolean;
  CreatedAt: number;
}

export enum API {
  GET_NOTIF = '/notif/v1/get/notif',
  GET_NOTIFS = '/notif/v1/get/notifs',
  UPDATE_NOTIF ='notif/v1/update/notif',
  GET_APP_USER_NOTIFS = '/notif/v1/get/app/user/notifs',
}
