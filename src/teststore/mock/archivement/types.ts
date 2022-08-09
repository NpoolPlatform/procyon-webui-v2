import { BaseRequest } from 'npool-cli-v2'

interface Archivement {
  CoinTypeID: string
  CoinName: string
  CoinLogo: string
  CoinUnit: string
  TotalUnits: number
  SelfUnits: number
  TotalAmount: string
  SelfAmount: string
  TotalCommission: string
  SelfCommission: string
  CurPercent: number
  CurGoodID: string
  CurGoodName: string
  CurGoodUnit: string
}

interface ProductArchivement {
  UserID: string
  Username: string
  EmailAddress: string
  PhoneNO: string
  FirstName: string
  LastName: string
  CreateAt: number
  Kol: boolean
  TotalInvitees: number
  Archivements: Array<Archivement>
}

interface GetArchivementRequest extends BaseRequest {
  Offset?: number
  Limit?: number
}
interface GetArchivementResponse {
  Archivements: ProductArchivement[]
  Total: number
}

export {
  Archivement,
  GetArchivementRequest,
  GetArchivementResponse,
  ProductArchivement
}
