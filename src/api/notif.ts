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

export const onMarkAll = (rows: Array<Notif>) => {
  if (rows.length === 0) {
    return
  }
  const reqs = []
  for (let i = 0; i < rows.length; i++) {
    reqs.push({ ID: rows[i].ID, Notified: true })
  }
  notif.updateNotifs({
    Infos: reqs,
    Message: {
    }
  }, () => {
    // TODO
  })
}
