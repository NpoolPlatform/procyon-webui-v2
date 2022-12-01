import { GoodArchivement, GoodProfit, UserArchivement } from 'npool-cli-v4'

interface BalanceGeneral{
  CoinTypeID: string;
  CoinName: string;
  CoinLogo: string;
  CoinUnit: string;
  Balance: number;
  Last24HoursBalance: number;
  USDValue: number;
  JPYValue: number;
}

interface TotalProfit {
  USDAmount: number;
  JPYAmount: number;
  Last24HourUSDAmount: number;
  Last24HourJPYAmount: number;
  Last30DayUSDAmount: number;
  Last30DayJPYAmount: number;
}

interface CoinProfit {
  CoinTypeID: string;
  Amount: number;
  USDAmount: number;
  JPYAmount: number;
  Last24HourAmount: number;
  Last24HourUSDAmount: number;
  Last24HourJPYAmount: number;
  Last30DayAmount: number;
  Last30DayUSDAmount: number;
  Last30DayJPYAmount: number;
}

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

export {
  BalanceGeneral,
  TotalProfit,
  CoinProfit
}
