import { GoodArchivement, GoodProfit, UserArchivement } from 'npool-cli-v4'

export interface MyGoodProfit extends GoodProfit {
  CoinPreSale: boolean;
  TotalInComing: number;
  TotalUSDInComing: number;
  Last24HoursInComing: number;
  Last24HoursUSDInComing: number;
  Last30DaysInComing: number;
  Last30DaysUSDInComing: number;
}

export interface MyGoodArchivement extends GoodArchivement {
  Editing: boolean;
}
export interface MyArchivement extends UserArchivement {
  Archivements: MyGoodArchivement[];
}
