<template>
  <div :class='[ "affiliate content-glass", child ? "child" : "", firstChild ? "first-child" : "", lastChild ? "last-child" : "" ]'>
    <div class='aff-top'>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <span class='aff-email'>{{ subusername }}</span>
      <span>{{ $t('MSG_ONBOARDED_USERS') }}:<span class='aff-number'>{{ referral?.InvitedCount }}</span></span>
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
                <!-- img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_COMMISSION_RATE_TIP') }}
                </p -->
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_UNITS') }}</span>
                <!-- img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_REFERRAL_UNITS_TIP') }}
                </p -->
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_TOTAL_SALES') }}</span>
                <!-- img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_TOTAL_SALES_TIP') }}
                </p -->
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_COMMISSION') }}</span>
                <!-- img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_REFERRAL_COMMISSION_TIP') }}
                </p -->
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class='aff-info' v-for='_good in lgoods' :key='_good.GoodID'>
            <td><span class='aff-product'>{{ good.getGoodByID(_good.GoodID)?.Good?.Good?.Title }}</span></td>
            <td v-if='_good.Editing'>
              <!-- <input type='number' v-model='_good.Percent' :min='0' :max='inviterGoodPercent(_good.GoodID)'> -->
              <select v-model='_good.Percent' class='kol-dropdown'>
                <option v-for='kol in userKOLOptions(inviterGoodPercent(_good.GoodID))' :key='kol'>
                  {{ kol }}
                </option>
              </select>
              <button @click='onSaveCommissionClick(_good)'>
                {{ $t('MSG_SAVE') }}
              </button>
            </td>
            <td v-else>
              <span class='aff-number'>{{ _good.Percent }}<span class='unit'>%</span></span>
              <button
                v-if='child'
                :class='[ "alt", goodOnline(_good.GoodID) ? "" : "in-active" ]'
                :disabled='!goodOnline(_good.GoodID)'
                @click='onSetCommissionClick(_good)'
              >
                {{ $t('MSG_SET') }}
              </button>
            </td>
            <td><span class='aff-number'>{{ goodUnits(_good.GoodID) }}<span class='unit'>{{ $t(good.getGoodByID(_good.GoodID)?.Good.Good.Unit) }}</span></span></td>
            <td><span class='aff-number'>{{ goodAmount(_good.GoodID).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td><span class='aff-number'>{{ goodCommission(_good.GoodID).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
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
  Referral,
  PriceCoinName,
  NotificationType,
  useInspireStore,
  useGoodStore,
  GoodSummary,
  PurchaseAmountSetting,
  formatTime,
  useLoginedUserStore,
  username as Username,
  AppUser,
  AppUserExtra
} from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalGoodStore, GoodItem } from '../../localstore'

import chevrons from '../../assets/chevrons.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

interface Props {
  child: boolean
  firstChild: boolean
  lastChild: boolean
  referral: Referral
}

const props = defineProps<Props>()
const child = toRef(props, 'child')
const firstChild = toRef(props, 'firstChild')
const lastChild = toRef(props, 'lastChild')
const referral = toRef(props, 'referral')

const showDetailSummary = ref(false)

const onShowMoreClick = () => {
  showDetailSummary.value = !showDetailSummary.value
}

const username = computed(() => {
  let name = referral.value?.Extra?.Username

  if (referral.value?.Extra?.LastName?.length && referral.value?.Extra?.FirstName?.length) {
    name = referral.value?.Extra?.LastName + ' ' + referral.value?.Extra?.FirstName
  }

  if (!name?.length) {
    name = referral.value?.Extra?.Username
  }

  if (!name?.length) {
    name = referral.value?.User?.EmailAddress
  }

  if (!name?.length) {
    name = referral.value?.User?.PhoneNO
  }

  return name
})

const subusername = computed(() => {
  let name = referral.value?.User?.EmailAddress

  if (!name?.length) {
    name = referral.value?.User?.PhoneNO
  }

  return name
})

const inspire = useInspireStore()
const goodCommission = (goodID: string) => {
  const index = inspire.GoodCommissions.findIndex((el) => {
    return el.GoodID === goodID && el.AppID === referral.value.User.AppID && el.UserID === referral.value.User.ID
  })
  return index < 0 ? 0 : inspire.GoodCommissions[index].Amount
}

const goodSummary = (goodID: string) => {
  const index = referral.value?.GoodSummaries.findIndex((el) => el.GoodID === goodID)
  return index === undefined || index < 0 ? {} as unknown as GoodSummary : referral.value?.GoodSummaries[index]
}

const good = useGoodStore()
const lgood = useLocalGoodStore()
const lgoods = computed(() => lgood.Goods.filter((el) => el.UserID === referral.value.User.ID))

const settings = computed(() => inspire.PurchaseAmountSettings.filter((el) => {
  return el.UserID === referral.value.User.ID
}).sort((a, b) => {
  return a.Start < b.Start ? 1 : -1
}))

const inviter = computed(() => {
  const index = inspire.Referrals.findIndex((el) => el.User.ID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as Referral : inspire.Referrals[index]
})
const userKOLOptions = computed(() => (maxKOL: number) => {
  const kolList = [30, 25, 15, 10, 5, 0]
  let index = kolList.findIndex(kol => kol <= maxKOL)
  return index === -1 ? [] : kolList.splice(++index)
})
const inviterGoodPercent = (goodID: string) => {
  let index = inviter.value.GoodSummaries.findIndex((el) => el.GoodID === goodID)
  let percent = 0
  if (index >= 0) {
    percent = inviter.value.GoodSummaries[index].Percent
  }
  index = inspire.PurchaseAmountSettings.findIndex((el) => el.UserID === logined.LoginedUser?.User.ID && el.GoodID === goodID && el.End === 0)
  if (index >= 0) {
    percent = inspire.PurchaseAmountSettings[index].Percent
  }
  return percent
}

const goodUnits = (goodID: string) => {
  return goodSummary(goodID).Units ? goodSummary(goodID).Units : 0
}

const goodAmount = (goodID: string) => {
  return goodSummary(goodID).Amount ? goodSummary(goodID).Amount : 0
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

const onSetCommissionClick = async (good: GoodItem) => {
  good.Editing = true
  await nextTick()
}

const logined = useLoginedUserStore()

const onSaveCommissionClick = (good: GoodItem) => {
  if (good.Percent > inviterGoodPercent(good.GoodID)) {
    good.Percent = inviterGoodPercent(good.GoodID)
    return
  }

  good.Editing = false
  inspire.createPurchaseAmountSetting({
    TargetUserID: referral.value.User.ID as string,
    InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
    InviteeName: Username(referral.value.User, referral.value.Extra, locale.value) as string,
    Info: {
      GoodID: good.GoodID,
      Percent: good.Percent,
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
    width: 48px;
  }

</style>
