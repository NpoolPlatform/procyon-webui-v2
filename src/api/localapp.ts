import { AppID } from 'src/const/const'
import { sdk } from 'src/npoolstore'

export * from 'src/npoolstore/sdk/localapp'
sdk.MyAppID.value = AppID
