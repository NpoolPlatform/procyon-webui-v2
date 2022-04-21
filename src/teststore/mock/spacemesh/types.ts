import { BaseRequest } from 'npool-cli-v2'

interface Stat {
  capacity: number
  decentral: number
  smeshers: number
  transactions: number
  accounts: number
  circulation: number
  rewards: number
  rewardsnumber: number
  security: number
  txsamount: number
}

interface Stats {
  current: Stat
  cumulative: Stat
}

interface Epoch {
  number: number
  end: number
  layerend: number
  layers: number
  layerstart: number
  start: number
  stats: Stats
}

interface Layer {
  number: number
  atxnumunits: number
  blocksnumber: number
  end: number
  epoch: number
  hash: string
  rewards: number
  smeshers: number
  start: number
  status: number
  txs: number
  txsamount: number
}

interface Network {
  netid: number
  genesis: number
  layers: number
  maxtx: number
  duration: number
  lastlayer: number
  lastlayerts: number
  lastapprovedlayer: number
  lastconfirmedlayer: number
  connectedpeers: number
  issynced: boolean
  syncedlayer: number
  toplayer: number
  verifiedlayer: number
}

interface NetworkInfo {
  epoch: Epoch
  layer: Layer
  network: Network
}

interface DevNet {
  netName: string,
  netID: number,
  conf: string,
  grpcAPI: string,
  jsonAPI: string,
  explorer: string,
  explorerAPI: string,
  explorerVersion: string,
  explorerConf: string,
  dash: string,
  dashAPI: string,
  dashVersion: string,
  repository: string,
  minNodeVersion: string,
  maxNodeVersion: string,
  minSmappRelease: string,
  latestSmappRelease: string,
  smappBaseDownloadUrl: string,
  nodeBaseDownloadUrl: string
}

type GetNetworksRequest = BaseRequest
type GetNetworkInfoRequest = BaseRequest

interface MockSpacemeshState {
  NetworkInfo: NetworkInfo
  Networks: Array<DevNet>
}

export {
  NetworkInfo,
  DevNet,
  GetNetworksRequest,
  GetNetworkInfoRequest,
  MockSpacemeshState
}
