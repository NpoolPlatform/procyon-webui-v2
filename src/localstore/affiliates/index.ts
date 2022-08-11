import { defineStore } from 'pinia'
import { ProductArchivement } from 'src/teststore'
import { LocalArchivement, LocalProductArchivement } from './types'

export const useLocalArchivementStore = defineStore('localarchivement', {
  state: () => ({
    Archivements: [] as Array<LocalProductArchivement>,
    Total: 0
  }),
  getters: {},
  actions: {
    /**
     * reconstruct archivement
     * @param elems ProductArchivement[]
     */
    addArchivement (elems: ProductArchivement[]) {
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
          CreatedAt: item.CreatedAt,
          InvitedAt: item.InvitedAt,
          Archivements: localArchivements
        } as LocalProductArchivement)
      })
      this.Archivements.sort((a, b) => a.InvitedAt > b.InvitedAt ? -1 : 1)
    }
  }
})

export * from './types'
