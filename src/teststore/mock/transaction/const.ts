export enum API {
  GET_DETAILS = '/ledger/v1/get/details',
  GET_WITHDRAWS = '/ledger/v1/get/withdraws',
  CREATE_WITHDRAW = '/ledger/v1/create/withdraw',
}

export enum AccountType {
  DEFAULT_SIGN_METHOD_TYPE = 'DefaultSignMethodType',
  MOBILE = 'Mobile',
  EMAIL = 'Email',
  TWITTER = 'Twitter',
  GITHUB = 'Github',
  FACEBOOK = 'Facebook',
  LINKEDIN = 'Linkedin',
  WECHAT = 'Wechat',
  GOOGLE = 'Google',
}
export enum WithdrawState {
  DefaultWithdrawState = 'DefaultWithdrawState',
  Reviewing = 'Reviewing',
  Transferring = 'Transferring',
  Rejected = 'Rejected',
  TransactionFail = 'TransactionFail',
  Successful = 'Successful',
}
