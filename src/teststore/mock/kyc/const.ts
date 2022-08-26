export enum DocumentType {
  DefaultKycDocumentType = 'DefaultKycDocumentType',
  IDCard = 'IDCard',
  DriverLicense ='DriverLicense',
  Passport = 'Passport'
}

export enum EntityType {
  DefaultKycEntityType = 'DefaultKycEntityType',
  Individual = 'Individual',
  Organization = 'Organization'
}

export enum KYCState {
  DefaultState = 'DefaultState',
  Approved = 'Approved',
  Reviewing = 'Reviewing',
  Rejected = 'Rejected'
}

export enum ImageType {
  DefaultKycImageType = 'DefaultKycImageType',
  FrontImg = 'FrontImg',
  BackImg = 'BackImg',
  SelfieImg = 'SelfieImg'
}

export enum API {
  CREATE_KYC = '/appuser/v1/create/kyc',
  GET_KYC = '/appuser/v1/get/kyc',
  GET_KYC_IMAGE = '/appuser/v1/get/kycimage',
  UPDATE_KYC = '/appuser/v1/update/kyc',
  UPLOAD_KYC_IMAGE = '/appuser/v1/upload/kycimage'
}
