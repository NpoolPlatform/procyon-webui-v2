import { notif } from 'src/npoolstore'

const _notif = notif.useNotifStore()
export const getNotifs = (offset: number, limit: number) => {
  _notif.getNotifs({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<notif.Notif>) => {
    if (error || rows.length < limit) {
      return
    }
    getNotifs(offset + limit, limit)
  })
}

export const onMarkAll = (rows: Array<notif.Notif>) => {
  if (rows.length === 0) {
    return
  }
  const reqs = []
  for (let i = 0; i < rows.length; i++) {
    reqs.push({ ID: rows[i].ID, Notified: true, EntID: rows[i].EntID })
  }
  _notif.updateNotifs({
    Infos: reqs,
    Message: {
    }
  }, () => {
    // TODO
  })
}
