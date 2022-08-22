import { doAction } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { API } from './const'
import { SignupRequest, SignupResponse, UserState, LoginHistory } from './types'

export const useUserStore = defineStore('luser', {
  state: (): UserState => ({
    LoginHistories: [] as Array<LoginHistory>,
    GoogleOTPAuth: '',
    GoogleSecret: ''
  }),
  getters: {
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
    }
  }
})

export * from './types'
