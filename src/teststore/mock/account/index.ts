import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import { API } from './const'
import {
  Account,
  CreateAccountRequest,
  CreateAccountResponse,
  GetUserAccountsRequest,
  GetUserAccountsResponse
} from './types'

export const useLocalAccountStore = defineStore('localaccount', {
  state: () => ({
    Accounts: {
      Accounts: [] as Array<Account>,
      Total: 0
    }
  }),
  getters: {
    getUserAccountByCoinTypeID: (state) => (id: string) => {
      return state.Accounts.Accounts.find((el) => el.CoinTypeID === id)
    }
  },
  actions: {
    getUserAccounts (req: GetUserAccountsRequest, done: (error: boolean, count?: number) => void) {
      doActionWithError<GetUserAccountsRequest, GetUserAccountsResponse>(
        API.GET_USER_ACCOUNTS,
        req,
        req.Message,
        (resp: GetUserAccountsResponse): void => {
          resp.Infos.forEach((el) => {
            const index = this.Accounts.Accounts.findIndex((ael) => ael.ID === el.ID)
            this.Accounts.Accounts.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, el)
          })
          this.Accounts.Total = resp.Total
          done(false, resp.Infos.length)
        },
        () => {
          done(true)
        }
      )
    },
    createAccount (req: CreateAccountRequest, done: (error: boolean) => void) {
      doActionWithError<CreateAccountRequest, CreateAccountResponse>(
        API.CREATE_ACCOUNT,
        req,
        req.Message,
        (resp: CreateAccountResponse): void => {
          const index = this.Accounts.Accounts.findIndex((ael) => ael.ID === resp.Info.ID)
          this.Accounts.Accounts.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false)
        },
        () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
