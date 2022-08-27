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
          <tr class='aff-info' v-for='(_good, idx) in visibleGoodsArchivements(referral.Archivements)' :key='idx'>
            <td><span class='aff-product'>{{ _good.CoinName }}</span></td>
            <td v-if='_good.Editing'>
              <select v-model='_good.CommissionPercent' class='kol-dropdown'>
                <option v-for='kol in userKOLOptions(inviterGoodPercent(_good.GoodID))' :key='kol'>
                  {{ kol }}
                </option>
              </select>
              <button @click='onSaveCommissionClick(referral,idx)'>
                {{ $t('MSG_SAVE') }}
              </button>
            </td>
            <td v-else>
              <span class='aff-number'>{{ _good.CommissionPercent }}<span class='unit'>%</span></span>
              <button
                v-if='child'
                :class='[ "alt", goodOnline(_good.GoodID) ? "" : "in-active" ]'
                :disabled='!goodOnline(_good.GoodID)'
                @click='onSetCommissionClick(_good)'
              >
                {{ $t('MSG_SET') }}
              </button>
            </td>
            <td><span class='aff-number'>{{ _good.TotalUnits }}<span class='unit'>{{ _good.GoodUnit?.length ? $t(_good.GoodUnit) : '' }}</span></span></td>
            <td><span class='aff-number'>{{ Number(_good.TotalAmount).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td>
              <span class='aff-number'>
                {{ child ? (_good.SuperiorCommission ? Number(_good.SuperiorCommission).toFixed(4) : 0.0000) : Number(_good.TotalCommission).toFixed(4) }}
                <span class='unit'>{{ PriceCoinName }}</span>
              </span>
            </td>
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
  formatTime
} from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import chevrons from '../../assets/chevrons.svg'
import { LocalArchivement, LocalProductArchivement } from 'src/localstore/affiliates/types'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
import { useBaseUserStore, useLocalUserStore, User } from 'npool-cli-v4'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

interface Props {
  child: boolean;
  firstChild: boolean;
  lastChild: boolean;
  referral: LocalProductArchivement;
}

const props = defineProps<Props>()
const child = toRef(props, 'child')
const firstChild = toRef(props, 'firstChild')
const lastChild = toRef(props, 'lastChild')
const referral = toRef(props, 'referral')

const logined = useLocalUserStore()
const baseuser = useBaseUserStore()

const username = computed(() => baseuser.displayName({
  FirstName: referral.value.FirstName,
  LastName: referral.value.LastName
} as User, locale.value))

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
const larchivement = useLocalArchivementStore()

// get parent
const inviter = computed(() => {
  const index = larchivement.Archivements.findIndex((el) => el.UserID === logined.User?.ID)
  return index < 0 ? undefined as unknown as LocalProductArchivement : larchivement.Archivements[index]
})
const inviterGoodPercent = (goodID: string) => {
  const good = inviter.value.Archivements.find((el) => el.GoodID === goodID)
  return good === undefined ? 0 : good.CommissionPercent
}

const userKOLOptions = computed(() => (maxKOL: number) => {
  const kolList = [30, 25, 15, 10, 5, 0]
  let index = kolList.findIndex(kol => kol <= maxKOL)
  return index === kolList.length - 1 || index === -1 ? [0] : kolList.splice(++index)
})

const goodOnline = (goodID: string) => {
  const index = good.AppGoods.findIndex((el) => el.GoodID === goodID)
  return index < 0 ? false : good.AppGoods[index].Online
}
const visibleGoodsArchivements = computed(() => (goodArchivements: Array<LocalArchivement>) => {
  return goodArchivements.filter((el) => goodVisible(el.GoodID))
})
const goodVisible = (goodID: string) => {
  const index = good.AppGoods.findIndex((el) => el.GoodID === goodID)
  return index < 0 ? false : good.AppGoods[index].Visible
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

const onSaveCommissionClick = (elem: LocalProductArchivement, idx:number) => {
  if (elem.Archivements[idx].CommissionPercent > inviterGoodPercent(elem.Archivements[idx].GoodID)) {
    elem.Archivements[idx].CommissionPercent = inviterGoodPercent(elem.Archivements[idx].GoodID)
    return
  }

  elem.Archivements[idx].Editing = false
  inspire.createPurchaseAmountSetting({
    TargetUserID: referral.value.UserID,
    InviterName: baseuser.displayName(logined.User, locale.value),
    InviteeName: username.value,
    Info: {
      GoodID: elem.Archivements[idx].GoodID,
      CoinTypeID: elem.Archivements[idx].CoinTypeID,
      Percent: elem.Archivements[idx].CommissionPercent,
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
