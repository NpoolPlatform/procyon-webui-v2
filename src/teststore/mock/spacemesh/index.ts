import { doGet } from 'npool-cli-v2'
import { defineStore } from 'pinia'
import { API, DEVNET_PATTERN } from './const'
import { DevNet, GetNetworkInfoRequest, GetNetworksRequest, MockSpacemeshState, NetworkInfo } from './types'

export const useMockSpacemeshStore = defineStore('mockspacemesh', {
  state: (): MockSpacemeshState => ({
    NetworkInfo: undefined as unknown as NetworkInfo,
    Networks: []
  }),
  getters: {},
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
