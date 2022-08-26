import { doAction, doActionWithError } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { API } from './const'
import { Cookies } from 'quasar'
import {
  SignupRequest,
  SignupResponse,
  UserState,
  LoginHistory,
  LoginRequest,
  User,
  LoginVerifyRequest,
  LoginResponse,
  LoginVerifyResponse,
  LogoutRequest,
  LogoutResponse,
  UpdateUserRequest,
  UpdateUserResponse
} from './types'

export const useUserStore = defineStore('localuser', {
  state: (): UserState => ({
    LoginHistories: [] as Array<LoginHistory>,
    GoogleOTPAuth: '',
    GoogleSecret: '',
    LoginedUser: {} as User
  }),
  getters: {
    getLogined (): boolean { return this.LoginedUser !== undefined && this.LoginedUser !== null }
  },
  actions: {
    signup (req: SignupRequest, done: () => void) {
      doAction<SignupRequest, SignupResponse>(
        API.SIGNUP,
        req,
        req.Message,
        (): void => {
          done()
        })
    },
    login (req: LoginRequest, done: () => void) {
      doAction<LoginRequest, LoginResponse>(
        API.LOGIN,
        req,
        req.Message,
        (resp: LoginResponse): void => {
          console.log(resp)
          // Cookies.set('X-User-ID', resp.Info.ID, { expires: '4h', secure: true })
          // Cookies.set('X-App-Login-Token', resp.Info.LoginToken, { expires: '4h', secure: true })
          done()
        })
    },
    loginVerify (req: LoginVerifyRequest, done: () => void) {
      doAction<LoginVerifyRequest, LoginVerifyResponse>(
        API.LOGIN_VERIFY,
        req,
        req.Message,
        (resp: LoginVerifyResponse): void => {
          if (resp.Info?.LoginVerified) {
            this.LoginedUser = resp.Info
            Cookies.set('X-User-ID', resp?.Info.ID, { expires: '4h', secure: true })
            Cookies.set('X-App-Login-Token', resp.Info.LoginToken, { expires: '4h', secure: true })
          }
          done()
        })
    },
    logout (req: LogoutRequest, done?: () => void) {
      doAction<LogoutRequest, LogoutResponse>(
        API.LOGOUT,
        req,
        req.Message,
        (resp: LogoutResponse): void => {
          Cookies.remove('X-User-ID')
          Cookies.remove('X-AppLogin-Token')
          console.log('logout: ', resp)
          this.LoginedUser = undefined as unknown as User
          done?.()
        })
    },
    updateUser (req: UpdateUserRequest, done: (user: User, error: boolean) => void) {
      doActionWithError<UpdateUserRequest, UpdateUserResponse>(
        API.UPDATE_USER,
        req,
        req.Message,
        (resp: UpdateUserResponse): void => {
          this.LoginedUser = resp.Info
          done(resp.Info, false)
        }, () => {
          done(undefined as unknown as User, true)
        })
    },
    updateAccount (req: UpdateUserRequest, done: (error: boolean) => void) {
      doActionWithError<UpdateUserRequest, UpdateUserResponse>(
        API.UPDATE_USER,
        req,
        req.Message,
        (resp: UpdateUserResponse): void => {
          this.LoginedUser = resp.Info
          done(false)
        }, () => {
          done(true)
        })
    }

  }
})

export * from './types'
