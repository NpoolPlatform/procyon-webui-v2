import { doGet, SecondsEachDay } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { API, DEVNET_PATTERN } from './const'
import { DevNet, GetNetworkInfoRequest, GetNetworksRequest, MockSpacemeshState, NetworkInfo } from './types'

export const useMockSpacemeshStore = defineStore('mockspacemesh', {
  state: (): MockSpacemeshState => ({
    NetworkInfo: undefined as unknown as NetworkInfo,
    Networks: []
  }),
  getters: {
    getLastDaysAvgOutput (): (ratio: number, accounts: number) => number {
      return (ratio: number, accounts: number) => {
        if (!this.NetworkInfo) {
          return 0
        }
        ratio = accounts / (accounts + this.NetworkInfo.epoch.stats.current.smeshers) * ratio
        const days = (new Date().getTime() / 1000 - this.NetworkInfo?.epoch?.start) / SecondsEachDay
        return this.NetworkInfo.epoch.stats.current.rewards / days * ratio / 1000000000000
      }
    },
    get30DaysAvgOutput (): (ratio: number, accounts: number) => number {
      return (ratio: number, accounts: number) => {
        if (!this.NetworkInfo) {
          return 0
        }
        ratio = accounts / (accounts + this.NetworkInfo.epoch.stats.current.smeshers) * ratio
        return this.getNetworkDailyOutput * ratio
      }
    },
    getNetworkDailyOutput (): number {
      const days = (new Date().getTime() / 1000 - this.NetworkInfo?.network?.genesis) / SecondsEachDay
      return this.NetworkInfo?.epoch?.stats?.cumulative?.circulation / days / 1000000000000
    }
  },
  actions: {
    getNetworks (req: GetNetworksRequest, done: () => void) {
      doGet<GetNetworksRequest, Array<DevNet>>(
        API.GET_NETWORKS,
        req,
        req.Message,
        (resp: Array<DevNet>): void => {
          this.Networks = resp
          done()
        }
      )
    },
    getNetworkInfo (req: GetNetworkInfoRequest, done: (error: boolean) => void) {
      if (this.Networks.length === 0) {
        done(true)
        return
      }

      const url = API.GET_NETWORK_INFO.replace(DEVNET_PATTERN, this.Networks[0].netName)

      doGet<GetNetworksRequest, NetworkInfo>(
        url,
        req,
        req.Message,
        (resp: NetworkInfo): void => {
          this.NetworkInfo = resp
          done(false)
        }
      )
    }
  }
})
