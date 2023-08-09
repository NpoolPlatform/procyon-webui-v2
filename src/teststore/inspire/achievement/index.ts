import { defineStore } from 'pinia'
import { API } from './const'
import { doActionWithError } from 'npool-cli-v4'
import { Achievement, GetAchievementsRequest, GetAchievementsResponse } from './types'

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
