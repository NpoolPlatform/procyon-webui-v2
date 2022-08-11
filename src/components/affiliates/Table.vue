<template>
  <h2>{{ $t('MSG_DIRECT_AFFILIATES') }}</h2>
  <div class='direct-ref content-glass'>
    <div class='row'>
      <div id='search-box'>
        <h4>{{ $t('MSG_SEARCH_ACCOUNTS') }}</h4>
        <form action='javascript: void(0)' @submit='onSearchSubmit'>
          <div class='sub-form'>
            <input id='search-field' type='text' v-model='searchStr' :placeholder='$t("MSG_AFFILIATES_SEARCH_PLACEHOLDER")'>
            <button v-if='searchStr.length > 0' class='search-reset' type='reset' @click='onSearchResetClick'>
              &times;
            </button>
          </div>
          <!-- input id='search-button' type='submit' :value='$t("MSG_SEARCH_RESULTS")' -->
        </form>
      </div>
      <q-space />
      <div v-show='coins.length >= 1' id='product-filter'>
        <h4>{{ $t('MSG_PRODUCT_FILTER') }}</h4>
        <form>
          <select v-model='selectedCoin'>
            <option
              v-for='_coin in coins'
              :key='_coin.value.ID'
              :value='_coin'
              :selected='_coin.value.ID === selectedCoin?.value.ID'
            >
              {{ _coin.label }}
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class='aff-table'>
      <table id='direct-ref-table'>
        <thead>
          <tr>
            <th><span>{{ $t('MSG_REFERRAL_ACCOUNT') }}</span></th>
            <th><span>{{ $t('MSG_JOIN_DATE') }}</span></th>
            <th><span>{{ $t('MSG_PURCHASE_AMOUNT') }}</span></th>
            <th><span>{{ $t('MSG_TOTAL_PAYMENT') }}</span></th>
            <th><span>{{ $t('MSG_COMMISSION') }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class='aff-info total-row'>
            <td><span class='aff-product'>{{ $t('MSG_TOTAL') }}</span></td>
            <td><span class='aff-number'><span class='unit'>{{ $t('MSG_NOT_AVAILABLE') }}</span></span></td>
            <td><span class='aff-number'>{{ getCoinTotalSummary('TotalUnits').toFixed(0) }}<span class='unit'>{{ $t(goodUnit) }}</span></span></td>
            <td><span class='aff-number'>{{ getCoinTotalSummary('TotalAmount').toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <td><span class='aff-number'>{{ getCoinTotalSummary('TotalCommission').toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
          </tr>
          <tr class='aff-info' v-for='referral in pageReferrals' :key='referral.UserID'>
            <td>
              <span class='aff-product'>{{ accountName(referral) }}</span>
              <img class='copy-button' :src='edit' @click='onSetKolClick(referral)'>
            </td>
            <td><span class='aff-number'>{{ joinDate(referral) }}<span class='unit'>{{ joinTime(referral) }}</span></span></td>
            <!-- <td><span class='aff-number'>{{ referralUnits(referral) }}<span class='unit'>{{ $t('goodUnit') }}</span></span></td> -->
            <!-- <td><span class='aff-number'>{{ referralUnits(referral) }}<span class='unit'>{{ 0 }}</span></span></td> -->
            <td><span class='aff-number'>{{ getTotal(referral, 'TotalUnits') }}<span class='unit'>{{ $t(goodUnit) }}</span></span></td>
            <td><span class='aff-number'>{{ getTotal(referral, 'TotalAmount').toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
            <!-- <td><span class='aff-number'>{{ referralAmount(referral).toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td> -->
            <!-- <td><span class='aff-number'>{{ referralContribution(referral).toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td> -->
            <td><span class='aff-number'>{{ getTotal(referral, 'TotalCommission').toFixed(0) }}<span class='unit'>{{ PriceCoinName }}</span></span></td>
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
import { computed, ref, watch } from 'vue'
import {
  formatTime,
  PriceCoinName,
  useCoinStore,
  Coin
} from 'npool-cli-v2'

import edit from '../../assets/edit.svg'
import { useRouter } from 'vue-router'
import { LocalArchivement, LocalProductArchivement, useLocalArchivementStore } from 'src/localstore/affiliates'

interface MyCoin {
  label: string;
  value: Coin;
}

const localArchivements = useLocalArchivementStore()
const referrals = computed(() => localArchivements.Archivements.filter((referral) => !referral.Kol).sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1))

const coin = useCoinStore()
const coins = computed(() => Array.from(coin.Coins.filter((el) => {
  const rfs = referrals.value.filter((rel) => {
    for (const sum of rel.Archivements) {
      if (sum.CoinTypeID === el.ID) {
        return true
      }
    }
    return false
  })
  return rfs.length > 0
}).map((el) => {
  return {
    label: el.Name,
    value: el
  } as MyCoin
})))
const selectedCoin = ref(coins.value.length ? coins.value[0] : undefined as unknown as MyCoin)
watch(coins, () => {
  selectedCoin.value = coins.value.length ? coins.value[0] : undefined as unknown as MyCoin
})

const goodUnit = computed(() => {
  for (const rf of referrals.value) {
    for (const sum of rf.Archivements) {
      if (sum.CoinTypeID === selectedCoin.value?.value.ID) {
        return sum.CurGoodUnit
      }
    }
  }
  return ''
})

const searchStr = ref('')
const displayReferrals = computed(() => referrals.value.filter((el) => {
  return el.EmailAddress?.includes(searchStr.value) || el.PhoneNO?.includes(searchStr.value)
}))

const onSearchSubmit = () => {
  // DO NOTHING
}
const onSearchResetClick = () => {
  searchStr.value = ''
}

const accountName = (referral: LocalProductArchivement) => {
  return referral.EmailAddress?.length ? referral.EmailAddress : referral.PhoneNO
}

const joinDate = (referral: LocalProductArchivement) => {
  return formatTime(referral.InvitedAt, true)
}

const joinTime = (referral: LocalProductArchivement) => {
  return formatTime(referral.InvitedAt, false)?.split(' ')[1]
}

// dynamic get object attribute in typescript
function prop<T extends object, K extends keyof T> (obj: T, key: K) {
  return obj[key]
}
const getTotal = computed(() => (referral: LocalProductArchivement, attr: keyof LocalArchivement) => {
  let total = 0
  const rfs = referral.Archivements.filter((el) => el.CoinTypeID === selectedCoin.value?.value.ID)
  rfs.forEach((el) => {
    const val = prop(el, attr)
    console.log('val: ', val)
    total += Number(val)
  })
  return total
})

const getCoinTotalSummary = computed(() => (attr: keyof LocalArchivement) => {
  let total = 0
  referrals.value.forEach((el) => {
    const products = el.Archivements.filter((product) => product.CoinTypeID === selectedCoin.value?.value.ID)
    products.forEach((product) => {
      const val = prop(product, attr)
      total += Number(val)
    })
  })
  return total
})
const router = useRouter()

const onSetKolClick = (referral: LocalProductArchivement) => {
  void router.push({
    path: '/setup/affiliate',
    query: {
      userId: referral.UserID
    }
  })
}

const page = ref(1)
const countPerPage = ref(10)
const pages = computed(() => Math.ceil(displayReferrals.value.length / countPerPage.value))

const pageReferrals = computed(() => displayReferrals.value.filter((el, index) => {
  console.log('displayReferrals: ', displayReferrals.value)
  console.log('pageReferrals: ', pageReferrals.value)
  return index >= (page.value - 1) * countPerPage.value && index < page.value * countPerPage.value
}))

</script>

<stype lang='sass' scoped>
.pagination
  max-width: 40%
</stype>
