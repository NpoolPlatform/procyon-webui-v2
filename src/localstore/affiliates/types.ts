import { Archivement } from 'src/teststore/mock/archivement/types'

export interface LocalArchivement extends Archivement{
  Editing: boolean;
}
export interface LocalProductArchivement {
  UserID: string;
  Username: string;
  EmailAddress: string;
  PhoneNO: string;
  FirstName: string;
  LastName: string;
  Kol: boolean;
  CreatedAt: number;
  TotalInvitees: number;
  InvitedAt: number;
  Archivements: Array<LocalArchivement>;
}
