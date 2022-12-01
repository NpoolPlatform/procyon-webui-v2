<template>
  <div :class='[ "affiliate content-glass", child ? "child" : "", firstChild ? "first-child" : "", lastChild ? "last-child" : "" ]'>
    <div class='aff-top'>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <span class='aff-email'>{{ archivement.subUsername(referral) }}</span>
      <span>{{ $t('MSG_ONBOARDED_USERS') }}:<span class='aff-number'>{{ referral.TotalInvitees }}</span></span>
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
          <tr class='aff-info' v-for='(_good, idx) in referral.Archivements' :key='idx'>
            <td><span class='aff-product'>{{ _good.CoinName }}</span></td>
            <td v-if='_good.Editing'>
              <KolOption v-model:percent='_good.CommissionPercent' :max='getGoodPercent(_good.GoodID)' />
              <button @click='onSaveCommissionClick(referral,idx)'>
                {{ $t('MSG_SAVE') }}
              </button>
            </td>
            <td v-else>
              <span class='aff-number'>{{ _good.CommissionPercent }}<span class='unit'>%</span></span>
              <button
                v-if='child'
                :class='[ "alt", good.online(_good.GoodID) ? "" : "in-active" ]'
                :disabled='!good.online(_good.GoodID)'
                @click='(_good.Editing = true)'
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
                <td><span class='aff-product'>{{ good.getGoodByID(setting.GoodID)?.GoodName }}</span></td>
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
  useInspireStore,
  PurchaseAmountSetting,
  formatTime
} from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, defineAsyncComponent } from 'vue'
import chevrons from '../../assets/chevrons.svg'
import {
  useBaseUserStore,
  useLocalUserStore,
  User,
  useAdminAppGoodStore,
  useFrontendArchivementStore,
  UserArchivement
} from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'
import { MyArchivement } from 'src/localstore/ledger/types'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale } = useI18n({ useScope: 'global' })

const KolOption = defineAsyncComponent(() => import('src/components/affiliates/KolOption.vue'))

interface Props {
  child: boolean;
  firstChild: boolean;
  lastChild: boolean;
  referral: MyArchivement;
}

const props = defineProps<Props>()
const child = toRef(props, 'child')
const firstChild = toRef(props, 'firstChild')
const lastChild = toRef(props, 'lastChild')
const target = toRef(props, 'referral')

const referral = ref(target.value)

const baseUser = useBaseUserStore()
const username = computed(() => baseUser.displayName({
  FirstName: referral.value.FirstName,
  LastName: referral.value.LastName
} as User, locale.value as string))

const logined = useLocalUserStore()
const good = useAdminAppGoodStore()

const archivement = useFrontendArchivementStore()
const getGoodPercent = computed(() => (goodID: string) => {
  const inviterArchivement = archivement.getArchivementByUserID(logined?.User.ID)
  return archivement.getInviterGoodPercent(inviterArchivement as UserArchivement, goodID)
})

const showDetailSummary = ref(false)
const onShowMoreClick = () => {
  showDetailSummary.value = !showDetailSummary.value
}

const inspire = useInspireStore()
const settings = computed(() => inspire.PurchaseAmountSettings.filter((el) => {
  return el.UserID === referral.value.UserID
}).sort((a, b) => {
  return a.Start < b.Start ? 1 : -1
}))
const settingDate = computed(() => (setting: PurchaseAmountSetting) => {
  return formatTime(setting.Start, true)
})
const settingTime = computed(() => (setting: PurchaseAmountSetting) => {
  return formatTime(setting.Start, false).split(' ')[1]
})

const onSaveCommissionClick = (row: MyArchivement, idx: number) => {
  console.log(row, idx)
  row.Archivements[idx].Editing = false
  // editing.value = false
  // if (visibleGoodsArchivements.value(referral.value.Archivements)[idx].CommissionPercent > inviterGoodPercent(visibleGoodsArchivements.value(referral.value.Archivements)[idx].GoodID)) {
  //   visibleGoodsArchivements.value(referral.value.Archivements)[idx].CommissionPercent = inviterGoodPercent(visibleGoodsArchivements.value(referral.value.Archivements)[idx].GoodID)
  //   return
  // }
  // if (visibleGoodsArchivements.value(referral.value.Archivements)[idx].CommissionPercent < 0) {
  //   visibleGoodsArchivements.value(referral.value.Archivements)[idx].CommissionPercent = 0
  //   return
  // }
  // visibleGoodsArchivements.value(referral.value.Archivements)[idx].Editing = false
  // inspire.createPurchaseAmountSetting({
  //   TargetUserID: referral.value.UserID,
  //   InviterName: baseUser.displayName(logined.User, locale.value as string),
  //   InviteeName: username.value,
  //   Info: {
  //     GoodID: visibleGoodsArchivements.value(referral.value.Archivements)[idx].GoodID,
  //     CoinTypeID: visibleGoodsArchivements.value(referral.value.Archivements)[idx].CoinTypeID,
  //     Percent: visibleGoodsArchivements.value(referral.value.Archivements)[idx].CommissionPercent,
  //     Start: Math.ceil(Date.now() / 1000),
  //     End: 0
  //   },
  //   Message: {
  //     Error: {
  //       Title: t('MSG_CREATE_AMOUNT_SETTING_FAIL'),
  //       Popup: true,
  //       Type: NotificationType.Error
  //     }
  //   }
  // }, () => {
  //   // TODO
  // })
}
</script>
