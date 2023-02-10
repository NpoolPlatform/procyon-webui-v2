import { useFrontendNotifStore, Notif } from 'npool-cli-v4'

const notif = useFrontendNotifStore()
export const getNotifs = (offset: number, limit: number) => {
  notif.getNotifs({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<Notif>) => {
    if (error || rows.length < limit) {
      return
    }
    getNotifs(offset + limit, limit)
  })
}
