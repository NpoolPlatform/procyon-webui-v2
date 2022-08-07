import { Archivement } from 'src/teststore/mock/archivement/types'

export interface LocalArchivement extends Archivement{
  Editing: boolean
}
export interface LocalUserProductArchivement {
  UserID: string
  Username: string
  EmailAddress: string
  PhoneNO: string
  FirstName: string
  LastName: string
  Kol: boolean
  CreateAt: number
  TotalInvitees: number
  Archivements: Array<LocalArchivement>
}
