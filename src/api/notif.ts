import { useFrontendNotifStore } from 'src/teststore/mock/notify'
import { Notif } from 'src/teststore/mock/notify/const'

const notif = useFrontendNotifStore()
export const getNotifs = (offset: number, limit: number) => {
  notif.getNotifs({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (rows: Array<Notif>, error: boolean) => {
    if (error || rows.length < limit) {
      return
    }
    getNotifs(offset + limit, limit)
  })
}
