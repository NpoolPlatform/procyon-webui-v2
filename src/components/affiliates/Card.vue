<template>
  <div :class='[ "affiliate content-glass", child ? "child" : "", firstChild ? "first-child" : "", lastChild ? "last-child" : "" ]'>
    <div class='aff-top'>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <span class='aff-email'>{{ subusername }}</span>
      <span>{{ $t('MSG_ONBOARDED_USERS') }}:<span class='aff-number'>{{ referral.TotalInvitees }}</span></span>
    </div>
    <div class='aff-table'>
      <table id='commission-table'>
        <thead>
          <tr>
            <th>
              <span>{{ $t('MSG_PRODUCT') }}</span>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_COMMISSION_RATE') }}</span>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_UNITS') }}</span>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_TOTAL_SALES') }}</span>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_COMMISSION') }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class='aff-info' v-for='(_good,idx) in referral.Archivements' :key='idx'>
            <td><span class='aff-product'>{{ _good.CoinName }}</span></td>
            <td v-if='_good.Editing'>
              <select v-model='_good.CurPercent' class='kol-dropdown'>
                <option v-for='kol in userKOLOptions(_good.CurPercent)' :key='kol'>
                  {{ kol }}
                </option>
              </select>
              <button @click='onSaveCommissionClick(referral,idx)'>
                {{ $t('MSG_SAVE') }}
              </button>
            </td>
            <td v-else>
              <span class='aff-number'>{{ _good.CurPercent }}<span class='unit'>%</span></span>
              <button
                v-if='child'
                :class='[ "alt", goodOnline(_good.CurGoodID) ? "" : "in-active" ]'
                :disabled='!goodOnline(_good.CurGoodID)'
                @click='onSetCommissionClick(_good)'
              >
                {{ $t('MSG_SET') }}
              </button>
            </td>
            <td><span class='aff-number'>{{ _good.TotalUnits }}<span class='unit'>{{ $t(_good.CoinUnit) }}</span></span></td>
            <td><span class='aff-number'>{{ Number(_good.TotalAmount).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td><span class='aff-number'>{{ Number(_good.TotalCommission).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <q-slide-transition>
      <div class='detailed-summary' v-show='showDetailSummary'>
        <h4>{{ $t('MSG_COMMISSION_HISTORY') }}</h4>
        <div class='aff-table'>
          <table id='history-table'>
            <thead>
              <tr>
                <th>{{ $t('MSG_PRODUCT') }}</th>
                <th>{{ $t('MSG_EFFECTIVE_DATE') }}</th>
                <th>{{ $t('MSG_COMMISSION_RATE') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class='aff-info' v-for='setting in settings' :key='setting.ID'>
                <td><span class='aff-product'>{{ good.getGoodByID(setting.GoodID)?.Good?.Good?.Title }}</span></td>
                <td><span class='aff-number'>{{ settingDate(setting) }}<span class='unit'>{{ settingTime(setting) }}</span></span></td>
                <td><span class='aff-number'>{{ setting.Percent }}<span class='unit'>%</span></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </q-slide-transition>
    <div class='buttons'>
      <button :class='[ "alt show-more", showDetailSummary ? "open" : "" ]' @click='onShowMoreClick'>
        <img :src='chevrons'>
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {
  PriceCoinName,
  NotificationType,
  useInspireStore,
  useGoodStore,
  PurchaseAmountSetting,
  formatTime,
  useLoginedUserStore,
  username as Username,
  AppUser,
  AppUserExtra
} from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import chevrons from '../../assets/chevrons.svg'
import { LocalArchivement, LocalProductArchivement } from 'src/localstore/affiliates/types'
import { useLocalArchivementStore } from 'src/localstore/affiliates'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

interface Props {
  child: boolean
  firstChild: boolean
  lastChild: boolean
  referral: LocalProductArchivement
}

const props = defineProps<Props>()
const child = toRef(props, 'child')
const firstChild = toRef(props, 'firstChild')
const lastChild = toRef(props, 'lastChild')
const referral = toRef(props, 'referral')

const username = computed(() => {
  let name = referral.value.Username

  if (referral.value?.LastName?.length && referral.value?.FirstName?.length) {
    name = referral.value.LastName + ' ' + referral.value.FirstName
  }

  if (!name?.length) {
    name = referral.value?.Username
  }

  if (!name?.length) {
    name = referral.value?.EmailAddress
  }

  if (!name?.length) {
    name = referral.value?.PhoneNO
  }

  return name
})
const subusername = computed(() => {
  let name = referral.value.EmailAddress

  if (!name?.length) {
    name = referral.value?.PhoneNO
  }

  return name
})
const showDetailSummary = ref(false)

const onShowMoreClick = () => {
  showDetailSummary.value = !showDetailSummary.value
}

const inspire = useInspireStore()

const good = useGoodStore()

const settings = computed(() => inspire.PurchaseAmountSettings.filter((el) => {
  return el.UserID === referral.value.UserID
}).sort((a, b) => {
  return a.Start < b.Start ? 1 : -1
}))
const localArchivement = useLocalArchivementStore()

// get parent
const inviter = computed(() => {
  const index = localArchivement.Archivements.findIndex((el) => el.UserID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivement.Archivements[index]
})

const userKOLOptions = computed(() => (maxKOL: number) => {
  const kolList = [30, 25, 15, 10, 5, 0]
  let index = kolList.findIndex(kol => kol <= maxKOL)
  return index === kolList.length - 1 || index === -1 ? [0] : kolList.splice(++index)
})

const inviterGoodPercent = (goodID: string) => {
  const index = inviter.value.Archivements.findIndex((el) => el.CurGoodID === goodID)
  return inviter.value.Archivements[index].CurPercent
}

const goodOnline = (goodID: string) => {
  const index = good.AppGoods.findIndex((el) => el.GoodID === goodID)
  return index < 0 ? false : good.AppGoods[index].Online
}

const settingDate = (setting: PurchaseAmountSetting) => {
  return formatTime(setting.Start, true)
}

const settingTime = (setting: PurchaseAmountSetting) => {
  return formatTime(setting.Start, false).split(' ')[1]
}

const onSetCommissionClick = async (good: LocalArchivement) => {
  good.Editing = true
  await nextTick()
}

const logined = useLoginedUserStore()

const onSaveCommissionClick = (elem: LocalProductArchivement, idx:number) => {
  if (elem.Archivements[idx].CurPercent > inviterGoodPercent(elem.Archivements[idx].CurGoodID)) {
    elem.Archivements[idx].CurPercent = inviterGoodPercent(elem.Archivements[idx].CurGoodID)
    return
  }

  elem.Archivements[idx].Editing = false
  inspire.createPurchaseAmountSetting({
    TargetUserID: referral.value.UserID,
    InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
    // FIXME: what is IDNumber
    InviteeName: Username(referral.value, { IDNumber: referral.value.UserID }, locale.value) as string,
    Info: {
      GoodID: elem.Archivements[idx].CurGoodID,
      Percent: elem.Archivements[idx].CurPercent,
      Start: Math.ceil(Date.now() / 1000),
      End: 0
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_AMOUNT_SETTING_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
}

</script>
<style>
  .kol-dropdown {
    padding: 4px 8px;
    margin: 0;
    width: 52px;
  }

</style>
