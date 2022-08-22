import { BaseRequest } from 'npool-cli-v2'
import { AccountType } from './const'

interface User {
  ID: string;
  AppID: string;
  EmailAddress: string;
  PhoneNO: string;
  ImportedFromAppID: string;
  ImportedFromAppName: string;
  ImportedFromAppLogo: string;
  ImportedFromAppHome: string;
  Username: string;
  AddressFieldsString: string;
  AddressFields: string[];
  Gender: string;
  PostalCode: string;
  Age: number;
  Birthday: number;
  Avatar: string;
  Organization: string;
  FirstName: string;
  LastName: string;
  IDNumber: string;
  SigninVerifyTypeStr: string;
  SigninVerifyType: string;
  SigninVerifyByGoogleAuthInt: number;
  SigninVerifyByGoogleAuth: boolean;
  GoogleAuthVerifiedInt: number;
  GoogleAuthVerified: boolean;
  BanAppUserID: string;
  Banned: boolean;
  BanMessage: string;
  GoogleSecret: string;
  HasGoogleSecret: boolean;
  Roles: string[];
  Logined: boolean;
  LoginAccount: string;
  LoginAccountType: string;
  LoginToken: string;
  LoginClientIP: string;
  LoginClientUserAgent: string;
  CreatedAt: number;
  InvitationCode: string;
  InvitationCodeConfirmed: boolean;
  LoginVerified: boolean;

}

interface SignupRequest extends BaseRequest{
  Account: string;
  PasswordHash: string;
  AccountType: AccountType;
  VerificationCode: string;
  InvitationCode: string;
}

export type SignupResponse = User

interface LoginRequest extends BaseRequest {
  Account: string;
  PasswordHash: string;
  AccountType: AccountType;
  ManMachineSpec: string;
  EnvironmentSpec?: string;
}
interface LoginResponse {
  Info: User;
}

interface LoginVerifyRequest extends BaseRequest {
  Token: string;
  VerificationCode: string;
}
interface LoginVerifyResponse {
  Info: User;
}

interface LogoutRequest extends BaseRequest {
  Token: string;
}
interface LogoutResponse {
  Info: User;
}
interface LoginHistory {
  ID: string;
  ClientIP: string;
  UserAgent: string;
  CreateAt: number;
  Location: string;
}

interface UserState {
  LoginHistories: Array<LoginHistory>;
  GoogleOTPAuth: string;
  GoogleSecret: string;
  LoginedUser: User;
}

export {
  User,
  AccountType,
  SignupRequest,
  LoginHistory,
  UserState,
  LoginRequest,
  LoginVerifyRequest,
  LoginResponse,
  LoginVerifyResponse,
  LogoutRequest,
  LogoutResponse
}
