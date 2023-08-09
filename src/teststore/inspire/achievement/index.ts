import { defineStore } from 'pinia'
import { API } from './const'
import { doActionWithError } from 'npool-cli-v4'
import { Achievement, GetAchievementsRequest, GetAchievementsResponse } from './types'
import { date } from 'quasar'

export const useAchievementStore = defineStore('achievement', {
  state: () => ({
    Achievements: [] as Array<Achievement>
  }),
  getters: {
    achievement (): (userID?: string) => Achievement | undefined {
      return (userID?: string) => {
        return this.Achievements.find((el) => el.UserID === userID)
      }
    },
    inviteeAchievements (): (userID: string) => Array<Achievement> {
      return (userID: string) => {
        return this.Achievements.filter((el) => el.UserID !== userID && el.Kol)
      }
    },
    inviterGoodPercent (): (inviterID: string, goodID: string) => number | undefined {
      return (inviterID: string, goodID: string) => {
        return this.Achievements.find((el) => el.UserID === inviterID)?.Achievements.find((el) => el.GoodID === goodID)?.CommissionPercent
      }
    },
    totalCommission () {
      return (userID: string) => {
        let total = 0
        this.Achievements.filter((el) => el.UserID === userID).forEach((el1) => {
          el1.Achievements.forEach((el2) => {
            total += Number(el2.TotalCommission)
          })
        })
        return total
      }
    },
    totalUnits () {
      return (achievements: Array<Achievement>, coinTypeID: string) => {
        let total = 0
        achievements.forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.TotalCommission)
          })
        })
        return total
      }
    },
    totalAmount () {
      return (achievements: Array<Achievement>, coinTypeID: string) => {
        let total = 0
        achievements.forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.TotalAmount)
          })
        })
        return total
      }
    },
    totalSuperiorCommission () {
      return (achievements: Array<Achievement>, coinTypeID: string) => {
        let total = 0
        achievements.forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.SuperiorCommission)
          })
        })
        return total
      }
    },
    userTotalUnits () {
      return (userID: string, coinTypeID: string) => {
        let total = 0
        this.Achievements.filter((el) => el.UserID === userID).forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.TotalUnits)
          })
        })
        return total
      }
    },
    userTotalAmount () {
      return (userID: string, coinTypeID: string) => {
        let total = 0
        this.Achievements.filter((el) => el.UserID === userID).forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.TotalAmount)
          })
        })
        return total
      }
    },
    userSuperiorCommission () {
      return (userID: string, coinTypeID: string) => {
        let total = 0
        this.Achievements.filter((el) => el.UserID === userID).forEach((el1) => {
          el1.Achievements.filter((el2) => el2.CoinTypeID === coinTypeID).forEach((el3) => {
            total += Number(el3.SuperiorCommission)
          })
        })
        return total
      }
    },
    joinTime () {
      return (referral: Achievement) => {
        return date.formatDate(referral.InvitedAt * 1000, 'YYYY/MM/DD HH:mm:ss')?.split(' ')?.[1]
      }
    },
    joinDate () {
      return (referral: Achievement) => {
        return date.formatDate(referral.InvitedAt * 1000, 'YYYY/MM/DD')
      }
    }
  },
  actions: {
    getAchievements (req: GetAchievementsRequest, done: (error: boolean, rows?: Array<Achievement>) => void) {
      doActionWithError<GetAchievementsRequest, GetAchievementsResponse>(
        API.GET_ACHIEVEMENTS,
        req,
        req.Message,
        (resp: GetAchievementsResponse): void => {
          this.Achievements.push(...resp.Infos)
          done(false, resp.Infos)
        }, () => {
          done(true)
        }
      )
    }
  }
})

export * from './types'
