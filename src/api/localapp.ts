import { AppID } from 'src/const/const'
import { useLocalApplicationStore } from 'src/npoolstore/appuser/app/local'

const localapp = useLocalApplicationStore()

export * from 'src/npoolstore/sdk/localapp'
localapp.MyAppID = AppID
