<template>
  <h2>{{ $t('MSG_DIRECT_AFFILIATES') }}</h2>
  <div class='direct-ref content-glass'>
    <div id='search-box'>
      <form action='javascript: void(0)' @submit='onSearchSubmit'>
        <input id='search-field' type='text' v-model='searchStr'>
        <button v-if='searchStr.length > 0' class='search-reset' type='reset' @click='onSearchResetClick'>
          &times;
        </button>
        <input id='search-button' type='submit' :value='$t("MSG_SEARCH_RESULTS")'>
      </form>
    </div>
    <!--<div id='product-filter'>
      <form>
        <select name='Filter Product'>
          <option value='Aleo' selected>Aleo</option>
          <option value='Spacemesh'>Spacemesh</option>
        </select>
      </form>
    </div>-->
    <div class='aff-table'>
      <table id='direct-ref-table'>
        <thead>
          <tr>
            <th><span>{{ $t('MSG_REFERRAL_ACCOUNT') }}</span></th>
            <th><span>{{ $t('MSG_JOIN_DATE') }}</span></th>
            <!-- th><span>Units</span></th>
            <th><span>Total Payment</span></th>
            <th><span>Commission</span></th -->
          </tr>
        </thead>
        <tbody>
          <!-- tr class='aff-info total-row'>
            <td><span class='aff-product'>TOTAL</span></td>
            <td><span class='aff-number'><span class='unit'>NA</span></span></td>
            <td><span class='aff-number'>4<span class='unit'>Units</span></span></td>
            <td><span class='aff-number'>2,000<span class='unit'>USDT</span></span></td>
            <td><span class='aff-number'>400<span class='unit'>USDT</span></span></td>
          </tr -->
          <tr class='aff-info' v-for='referral in pageReferrals' :key='referral.User.ID'>
            <td>
              <span class='aff-product'>{{ accountName(referral) }}</span>
              <img class='copy-button' :src='edit' @click='onSetKolClick(referral)'>
            </td>
            <td><span class='aff-number'>{{ joinDate(referral) }}<span class='unit'>{{ joinTime(referral) }}</span></span></td>
            <!-- td><span class='aff-number'>2<span class='unit'>Units</span></span></td>
            <td><span class='aff-number'>1,000<span class='unit'>USDT</span></span></td>
            <td><span class='aff-number'>200<span class='unit'>USDT</span></span></td -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class='row'>
      <q-space />
      <div class='pagination'>
        <q-pagination
          dense
          color='white'
          active-color='orange-1'
          v-model='page'
          :max='pages'
          :max-pages='5'
          boundary-links
          direction-links
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import {
  NotificationType,
  formatTime,
  Referral,
  useInspireStore
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import edit from '../../assets/edit.svg'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const referrals = computed(() => inspire.Referrals.filter((referral) => !referral.Kol))

const searchStr = ref('')
const displayReferrals = ref(referrals.value)
const onSearchSubmit = () => {
  displayReferrals.value = referrals.value.filter((el) => {
    return el.User.EmailAddress?.includes(searchStr.value) || el.User.PhoneNO?.includes(searchStr.value)
  })
}
const onSearchResetClick = () => {
  searchStr.value = ''
  displayReferrals.value = referrals.value
}

const accountName = (referral: Referral) => {
  return referral.User?.EmailAddress?.length ? referral.User?.EmailAddress : referral.User?.PhoneNO
}

const joinDate = (referral: Referral) => {
  return formatTime(referral.Invitation.CreateAt, true)
}

const joinTime = (referral: Referral) => {
  return formatTime(referral.Invitation.CreateAt, false).split(' ')[1]
}

const router = useRouter()

const onSetKolClick = (referral: Referral) => {
  void router.push({
    path: '/setup/affiliate',
    query: {
      userId: referral.User.ID
    }
  })
}

onMounted(() => {
  if (referrals.value.length === 0) {
    inspire.getReferrals({
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      displayReferrals.value = inspire.Referrals.filter((referral) => !referral.Kol)
    })
  }
})

const page = ref(1)
const countPerPage = ref(10)
const pages = computed(() => Math.ceil(displayReferrals.value.length / countPerPage.value))

const pageReferrals = computed(() => displayReferrals.value.filter((el, index) => {
  return index >= (page.value - 1) * countPerPage.value && index < page.value * countPerPage.value
}))

</script>

<stype lang='sass' scoped>
.pagination
  max-width: 40%
</stype>
