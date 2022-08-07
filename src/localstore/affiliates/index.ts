import { defineStore } from 'pinia'
import { UserProductArchivement } from 'src/teststore'
import { LocalArchivement, LocalUserProductArchivement } from './types'

export const useLocalArchivementStore = defineStore('localarchivement', {
  state: () => ({
    Archivements: [] as Array<LocalUserProductArchivement>,
    Total: 0
  }),
  getters: {},
  actions: {
    /**
     * reconstruct archivement
     * @param elems UserProductArchivement[]
     */
    addArchivement (elems: UserProductArchivement[]) {
      elems.forEach((item) => {
        const localArchivements = [] as Array<LocalArchivement>
        item.Archivements.forEach((el) => {
          localArchivements.push({
            CoinTypeID: el.CoinName,
            CoinName: el.CoinName,
            CoinLogo: el.CoinLogo,
            CoinUnit: el.CoinUnit,
            TotalUnits: el.TotalUnits,
            SelfUnits: el.SelfUnits,
            TotalAmount: el.TotalAmount,
            SelfAmount: el.SelfAmount,
            TotalCommission: el.TotalCommission,
            SelfCommission: el.SelfCommission,
            CurPercent: el.CurPercent,
            CurGoodID: el.CurGoodID,
            CurGoodName: el.CurGoodName,
            CurGoodUnit: el.CurGoodUnit,
            Editing: false
          })
        })
        this.Archivements.push({
          UserID: item.UserID,
          Username: item.Username,
          EmailAddress: item.EmailAddress,
          PhoneNO: item.PhoneNO,
          FirstName: item.FirstName,
          LastName: item.LastName,
          Kol: item.Kol,
          TotalInvitees: item.TotalInvitees,
          Archivements: localArchivements
        } as LocalUserProductArchivement)
      })
    }
  }
})

export * from './types'
