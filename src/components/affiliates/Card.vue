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
                <img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_COMMISSION_RATE_TIP') }}
                </p>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_UNITS') }}</span>
                <img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_REFERRAL_UNITS_TIP') }}
                </p>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_TOTAL_SALES') }}</span>
                <img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_TOTAL_SALES_TIP') }}
                </p>
              </div>
            </th>
            <th>
              <div class='tooltip'>
                <span>{{ $t('MSG_REFERRAL_COMMISSION') }}</span>
                <img class='more-info' :src='question'>
                <p class='tooltip-text'>
                  {{ $t('MSG_REFERRAL_COMMISSION_TIP') }}
                </p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class='aff-info' v-for='_good in goods' :key='_good.Good.Good.ID'>
            <td><span class='aff-product'>{{ _good.Main?.Name }}</span></td>
            <td>
              <span class='aff-number'>{{ goodPercent(_good.Good.Good.ID as string) }}<span class='unit'>%</span></span>
              <button
                :class='[ "alt", goodOnline(_good.Good.Good.ID as string) ? "" : "in-active" ]'
                :disabled='goodOnline(_good.Good.Good.ID as string)'
                @click='onSetCommissionClick'
              >
                {{ $t('MSG_SET') }}
              </button>
            </td>
            <td><span class='aff-number'>{{ goodUnits(_good.Good.Good.ID as string) }}<span class='unit'>{{ $t(_good.Good.Good.Unit) }}</span></span></td>
            <td><span class='aff-number'>{{ goodAmount(_good.Good.Good.ID as string).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td><span class='aff-number'>{{ goodCommission(_good.Good.Good.ID as string).toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <q-slide-transition>
      <div class='detailed-summary' v-show='showDetailSummary'>
        <h4>Commission History</h4>
        <div class='aff-table'>
          <table id='history-table'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Effective Date</th>
                <th>Commmission</th>
              </tr>
            </thead>
            <tbody>
              <tr class='aff-info'>
                <td><span class='aff-product'>Aleo</span></td>
                <td><span class='aff-number'>2022-06-04<span class='unit'>16:34:05</span></span></td>
                <td><span class='aff-number'>15<span class='unit'>%</span></span></td>
              </tr>
              <tr class='aff-info'>
                <td><span class='aff-product'>Aleo</span></td>
                <td><span class='aff-number'>2022-06-01<span class='unit'>16:34:05</span></span></td>
                <td><span class='aff-number'>10<span class='unit'>%</span></span></td>
              </tr>
              <tr class='aff-info'>
                <td><span class='aff-product'>Spacemesh</span></td>
                <td><span class='aff-number'>2022-06-01<span class='unit'>16:34:05</span></span></td>
                <td><span class='aff-number'>10<span class='unit'>%</span></span></td>
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
import { Referral, PriceCoinName, NotificationType, useInspireStore, useGoodStore, GoodSummary } from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import chevrons from '../../assets/chevrons.svg'
import question from '../../assets/question.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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
  const index = inspire.GoodCommissions.findIndex((el) => el.GoodID === goodID)
  return index < 0 ? 0 : inspire.GoodCommissions[index].Amount
}

const goodSummary = (goodID: string) => {
  const index = referral.value.GoodSummaries.findIndex((el) => el.GoodID === goodID)
  return index < 0 ? {} as unknown as GoodSummary : referral.value.GoodSummaries[index]
}

const good = useGoodStore()
const goods = computed(() => good.Goods)

const goodPercent = (goodID: string) => {
  return goodSummary(goodID).Percent ? goodSummary(goodID).Percent : 0
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

const onSetCommissionClick = () => {
  // TODO
}

onMounted(() => {
  if (inspire.GoodCommissions.length === 0) {
    inspire.getGoodCommissions({
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_COMMISSIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

  if (good.Goods.length === 0) {
    good.getGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })

    good.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }
})

</script>
