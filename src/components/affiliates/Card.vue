<template>
  <div
    :class='["affiliate content-glass", child ? "child" : "", firstChild ? "first-child" : "", lastChild ? "last-child" : ""]'
  >
    <div class='aff-top'>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <span class='aff-email'>{{ referral?.EmailAddress?.length > 0 ? referral?.EmailAddress : referral?.PhoneNO }}</span>
      <span>
        {{ $t('MSG_ONBOARDED_USERS') }}:<span class='aff-number'>{{ utils.getLocaleString(referral.TotalInvitees)}}</span>
      </span>
    </div>
    <div class='aff-table'>
      <table id='commission-table'>
        <thead>
          <tr>
            <th><span>{{ $t('MSG_PRODUCT') }}</span></th>
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
                <span>{{ $t('MSG_REFERRAL_COMMISSION') }} </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class='aff-info' v-for='(_good, idx) in goodAchievements' :key='idx'>
            <td>
              <span
                class='aff-product'
                v-html='$t(sdk.appPowerRental.displayName(_good.AppGoodID, 4) as string)'
              />
            </td>
            <td v-if='_good.Editing'>
              <KolOption v-model:percent='_good.CommissionValue' :max='getGoodCommissionValue(_good.AppGoodID)' />
              <button @click='onSaveCommissionClick(_good)'>
                {{ $t('MSG_SAVE') }}
              </button>
            </td>
            <td v-else>
              <span class='aff-number'>{{ _good.CommissionValue }}<span class='unit'>%</span></span>
              <button
                v-if='child'
                :class='["alt", !sdk.appPowerRental.enableSetCommission(_good.AppGoodID) || !sdk.appPowerRental.canBuy(_good.AppGoodID) ? "in-active" : ""]'
                :disabled='!sdk.appPowerRental.enableSetCommission(_good.AppGoodID) || !sdk.appPowerRental.canBuy(_good.AppGoodID)'
                @click='() => _good.Editing = true'
              >
                {{ $t('MSG_SET') }}
              </button>
            </td>
            <td>
              <span class='aff-number'>
                {{ utils.getLocaleString(_good.TotalUnits) }}
                <span class='unit'>{{
                  _good.GoodUnit?.length ? $t(_good.GoodUnit) : '' }}
                </span>
              </span>
            </td>
            <td>
              <span class='aff-number'>{{ utils.getLocaleString(Math.floor(Number(_good.TotalAmount) * 100) / 100, 2)
              }}<span class='unit'>{{ constant.PriceCoinName }}</span></span>
            </td>
            <td>
              <span class='aff-number'>
                {{ child ?
                  (_good.SuperiorCommission ? utils.getLocaleString(Math.floor(Number(_good.SuperiorCommission) * 100) / 100, 2) : "0.00") :
                  utils.getLocaleString(Math.floor(Number(_good.TotalCommission) * 100) / 100, 2)
                }}
                <span class='unit'>{{ constant.PriceCoinName }}</span>
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
              <tr class='aff-info' v-for='__commission in commissions' :key='__commission.ID'>
                <td>
                  <span
                    class='aff-product'
                    v-html='$t(sdk.appPowerRental.displayName(__commission.AppGoodID, 4) as string)'
                  />
                </td>
                <td>
                  <span class='aff-number'>{{ utils.formatTime(__commission.StartAt, 'YYYY/MM/DD') }}</span>
                  <span class='unit'>{{ ' ' + utils.formatTime(__commission.StartAt, 'HH:mm:ss') }}</span>
                </td>
                <td><span class='aff-number'>{{ __commission.AmountOrPercent }}<span class='unit'>%</span></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </q-slide-transition>
    <div class='buttons'>
      <button :class='["alt show-more", showDetailSummary ? "open" : ""]' @click='onShowMoreClick'>
        <img :src='chevrons'>
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, toRef, defineProps, computed, defineAsyncComponent } from 'vue'
import chevrons from '../../assets/chevrons.svg'
import { useI18n } from 'vue-i18n'
import { MyGoodAchievement } from 'src/localstore'
import { commission, achievement, constant, user, notify, utils, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale } = useI18n({ useScope: 'global' })

const KolOption = defineAsyncComponent(() => import('src/components/affiliates/KolOption.vue'))

interface Props {
  child: boolean
  firstChild: boolean
  lastChild: boolean
  referral: achievement.Achievement
}

const props = defineProps<Props>()
const child = toRef(props, 'child')
const firstChild = toRef(props, 'firstChild')
const lastChild = toRef(props, 'lastChild')
const target = toRef(props, 'referral')
const referral = ref(target.value)

const _user = user.useUserStore()
const username = computed(() => _user.displayName(undefined, undefined, referral.value?.FirstName,
  referral.value?.LastName, locale.value as string))

const logined = user.useLocalUserStore()

const _achievement = achievement.useAchievementStore()
const _goodAchievements = ref(computed(() => Array.from(referral.value?.Achievements.filter((el) => {
  return (
    sdk.appPowerRental.canBuy(el.AppGoodID) ||
    sdk.appPowerRental.visible(el.AppGoodID) ||
    sdk.appPowerRental.spotQuantity(el.AppGoodID)
  ) && !sdk.appPowerRental.appPowerRental(el.AppGoodID)?.TestOnly
})).sort((a, b) => a.GoodName.localeCompare(b.GoodName, 'zh-CN')).map((el) => {
  return {
    ...el,
    Editing: false
  } as MyGoodAchievement
})))
const goodAchievements = ref(_goodAchievements.value)
const getGoodCommissionValue = computed(() => (appGoodID: string) => {
  return Number(_achievement.commissionPercent(undefined, logined?.User.EntID, undefined, appGoodID))
})
const getGoodCommissionSettleMode = computed(() => (appGoodID: string) => {
  return _achievement.settleMode(undefined, logined?.User.EntID, undefined, appGoodID) as commission.SettleMode
})
const getGoodCommissionSettleAmountType = computed(() => (appGoodID: string) => {
  return _achievement.settleAmountType(undefined, logined?.User.EntID, undefined, appGoodID) as commission.SettleAmountType
})
const getGoodCommissionSettleInterval = computed(() => (appGoodID: string) => {
  return _achievement.settleInterval(undefined, logined?.User.EntID, undefined, appGoodID) as commission.SettleInterval
})
const getGoodCommissionThreshold = computed(() => (appGoodID: string) => {
  return _achievement.threshold(undefined, logined?.User.EntID, undefined, appGoodID)
})

const showDetailSummary = ref(false)
const onShowMoreClick = () => {
  showDetailSummary.value = !showDetailSummary.value
}

const _commission = commission.useCommissionStore()
const commissions = computed(() => _commission.commissions(undefined, referral.value.UserID))

const onSaveCommissionClick = (row: MyGoodAchievement) => {
  if (Number(row.CommissionValue) > getGoodCommissionValue.value(row.AppGoodID)) {
    row.CommissionValue = getGoodCommissionValue.value(row.AppGoodID).toString()
  }
  if (Number(row.CommissionValue) < 0) {
    row.CommissionValue = '0'
  }

  row.Editing = false
  _commission.createCommission({
    TargetUserID: referral.value.UserID,
    AppGoodID: row.AppGoodID,
    SettleType: commission.SettleType.GoodOrderPayment,
    SettleAmountType: getGoodCommissionSettleAmountType.value(row.AppGoodID),
    SettleMode: getGoodCommissionSettleMode.value(row.AppGoodID),
    SettleInterval: getGoodCommissionSettleInterval.value(row.AppGoodID),
    Threshold: getGoodCommissionThreshold.value(row.AppGoodID).toString(),
    AmountOrPercent: `${row.CommissionValue}`,
    StartAt: Math.ceil(Date.now() / 1000),
    Message: {
      Error: {
        Title: 'MSG_CREATE_COMMISSION',
        Message: 'MSG_CREATE_COMMISSION_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
