import { request, constant } from 'src/npoolstore'
import { defineStore } from 'pinia'
import { API, DEVNET_PATTERN } from './const'
import {
  DevNet,
  Epoch,
  GetNetworksRequest,
  GetEpochsRequest,
  GetEpochsResponse
} from './types'

export const useMockSpacemeshStore = defineStore('mock-spacemesh', {
  state: () => ({
    Networks: {
      Networks: [] as Array<DevNet>,
      Total: 0
    },
    Epochs: {
      Epochs: [] as Array<Epoch>,
      Total: 0
    }
  }),
  getters: {
    latestEpoch () : Epoch {
      return this.Epochs.Epochs?.[0]
    },
    genesis () : number {
      const row = this.latestEpoch
      return row?.end - ((row?.end - row?.start) * this.Epochs.Total)
    },
    accounts () : number {
      const row = this.latestEpoch
      return !row ? 0 : row.stats?.current?.accounts
    },
    getLastDaysAvgOutput (): (ratio: number, accounts: number) => number {
      return (ratio: number, accounts: number) => {
        ratio = accounts / (accounts + this.latestEpoch?.stats?.current?.accounts) * ratio * 20
        const days = (new Date().getTime() / 1000 - this.genesis) / constant.SecondsEachDay
        const scale = Math.random() / 10 * 2 + 0.9
        return this.latestEpoch?.stats?.cumulative?.circulation / days * ratio / 1000000000000 * scale
      }
    },
    getEarning (): (ratio: number, accounts: number) => number {
      return (ratio: number, accounts: number) => {
        ratio = accounts / (accounts + this.latestEpoch?.stats?.current?.accounts) * ratio * 20
        return this.latestEpoch?.stats?.cumulative?.circulation * ratio / 1000000000000
      }
    },
    get30DaysAvgOutput (): (ratio: number, accounts: number) => number {
      return (ratio: number, accounts: number) => {
        const days = (new Date().getTime() / 1000 - this.genesis) / constant.SecondsEachDay
        return this.getEarning(ratio, accounts) / days
      }
    },
    getNetworkDailyOutput (): number {
      const days = (new Date().getTime() / 1000 - this.genesis) / constant.SecondsEachDay
      return this.latestEpoch?.stats?.cumulative?.circulation / days / 1000000000000
    }
  },
  actions: {
    getNetworks (req: GetNetworksRequest, done: (error: boolean, rows: Array<DevNet>) => void) {
      request.doGetWithError<GetNetworksRequest, Array<DevNet>>(
        API.GET_NETWORKS,
        req,
        req.Message,
        (resp: Array<DevNet>): void => {
          this.Networks.Networks = resp
          this.Networks.Total = resp.length
          done(false, resp)
        },
        () => {
          done(true, [] as Array<DevNet>)
        }
      )
    },
    getEpochs (req: GetEpochsRequest, done: (error: boolean) => void) {
      const url = API.GET_EPOCHS.replace(DEVNET_PATTERN, this.Networks.Networks?.[0]?.netName)
      request.doGet<GetEpochsRequest, GetEpochsResponse>(
        url,
        req,
        req.Message,
        (resp: GetEpochsResponse): void => {
          this.Epochs.Epochs = resp.data
          this.Epochs.Total = resp.pagination.totalCount
          done(false)
        }
      )
    }
  }
})
