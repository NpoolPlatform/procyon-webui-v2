import { BaseRequest } from 'npool-cli-v4'

export interface DevNet {
  netName: string;
  netID: number;
  conf: string;
  grpcAPI: string;
  jsonAPI: string;
  explorer: string;
  explorerAPI: string;
  explorerVersion: string;
  explorerConf: string;
  dash: string;
  dashAPI: string;
  dashVersion: string;
  repository: string;
  minNodeVersion: string;
  maxNodeVersion: string;
  minSmappRelease: string;
  latestSmappRelease: string;
  smappBaseDownloadUrl: string;
  nodeBaseDownloadUrl: string;
}
interface Stat {
  capacity: number;
  decentral: number;
  smeshers: number;
  transactions: number;
  accounts: number;
  circulation: number;
  rewards: number;
  rewardsnumber: number;
  security: number;
  txsamount: number;
}

interface Stats {
  current: Stat;
  cumulative: Stat;
}
export interface Epoch {
  number: number;
  end: number;
  layerend: number;
  layers: number;
  layerstart: number;
  start: number;
  stats: Stats;
}

export interface Layer {
  number: number;
  atxnumunits: number;
  blocksnumber: number;
  end: number;
  epoch: number;
  hash: string;
  rewards: number;
  smeshers: number;
  start: number;
  status: number;
  txs: number;
  txsamount: number;
}
export interface Pagination {
  totalCount: number;
  pageCount: number;
  perPage: number;
  next: number;
  previous: number;
  hasNext: boolean;
  hasPrevious: boolean;
  current: number;
}

export type GetNetworksRequest = BaseRequest

export type GetEpochsRequest = BaseRequest
export interface GetEpochsResponse {
  data: Array<Epoch>;
  pagination: Pagination;
}

export type GetLayersRequest = BaseRequest
export interface GetLayersResponse {
  data: Array<Layer>;
  pagination: Pagination;
}
