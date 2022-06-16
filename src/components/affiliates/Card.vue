<template>
  <div :class='[ "affiliate content-glass", child ? "child" : "", firstChild ? "first-child" : "", lastChild ? "last-child" : "" ]'>
    <div class='aff-top'>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <span class='aff-email'>{{ subusername }}</span>
      <span>{{ $t('MSG_ONBOARDED_USERS') }}:<span class='aff-number'>{{ referral.InvitedCount }}</span></span>
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
          <tr class='aff-info' v-for='summary in referral.GoodSummaries' :key='summary.GoodID'>
            <td><span class='aff-product'>{{ summary.CoinName }}</span></td>
            <td><span class='aff-number'>{{ summary.Percent ? summary.Percent : 0 }}<span class='unit'>%</span></span></td>
            <td><span class='aff-number'>{{ summary.Units }}<span class='unit'>{{ summary.Unit }}</span></span></td>
            <td><span class='aff-number'>{{ summary.Amount?.toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td><span class='aff-number'>{{ commission.Total.toFixed(4) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
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
import { Referral, PriceCoinName, useBenefitStore, NotificationType } from 'npool-cli-v2'
import { ref, toRef, defineProps, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

import chevrons from '../../assets/chevrons.svg'
import question from '../../assets/question.svg'

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

const benefit = useBenefitStore()
const commission = computed(() => benefit.Commission)

onMounted(() => {
  if (benefit.Commission.Total === 0) {
    benefit.getCommission({
      Message: {
        Error: {
          Title: t('MSG_GET_COMMISSION_FAIL'),
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
