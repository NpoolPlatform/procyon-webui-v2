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
import { computed, onMounted, ref, watch } from 'vue'
import {
  NotificationType,
  formatTime,
  PriceCoinName,
  useCoinStore,
  Coin
} from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

import edit from '../../assets/edit.svg'
import { useRouter } from 'vue-router'
// import { LocalArchivement, LocalUserProductArchivement } from 'src/localstore/affiliates/types'
// import { useArchivementStore, UserProductArchivement } from 'src/teststore/mock/archivement'
import { LocalArchivement, LocalUserProductArchivement, useLocalArchivementStore } from 'src/localstore/affiliates'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface MyCoin {
  label: string
  value: Coin
}

// const inspire = useInspireStore()
// const referrals = computed(() => inspire.Referrals.filter((referral) => !referral.Kol))
const localArchivements = useLocalArchivementStore()
const referrals = computed(() => localArchivements.Archivements.filter((referral) => !referral.Kol))

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

// const totalUnits = computed(() => {
//   let units = 0
//   console.log('selectedCoin: ', selectedCoin.value?.value.ID)
//   referrals.value.forEach((el) => {
//     const sums = el.Archivements.filter((sel) => sel.CoinTypeID === selectedCoin.value?.value.ID)
//     sums.forEach((sum) => { units += Number(sum.CoinUnit) })
//   })
//   return units
// })
// const totalAmount = computed(() => {
//   let amount = 0
//   referrals.value.forEach((el) => {
//     const sums = el.Archivements.filter((sel) => sel.CoinTypeID === selectedCoin.value?.value.ID)
//     sums.forEach((sum) => { amount += Number(sum.TotalAmount) })
//   })
//   return amount
// })
// const totalContribution = computed(() => {
//   let amount = 0
//   const comms = inspire.GoodCommissions.filter((gel) => {
//     const index = referrals.value.findIndex((el) => gel.UserID === el.UserID)
//     if (index < 0) {
//       return false
//     }
//     return gel.CoinTypeID === selectedCoin.value?.value.ID
//   })
//   comms.forEach((gel) => {
//     if (gel.Contribution) {
//       amount += gel.Contribution
//     }
//   })
//   return amount
// })
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

const displayReferrals = ref(referrals.value.sort((a, b) => a.CreateAt > b.CreateAt ? -1 : 1))
const searchStr = ref('')
watch(searchStr, () => {
  displayReferrals.value = referrals.value.filter((el) => {
    return el.EmailAddress?.includes(searchStr.value) || el.PhoneNO?.includes(searchStr.value)
  }).sort((a, b) => a.CreateAt > b.CreateAt ? -1 : 1)
})

const onSearchSubmit = () => {
  // DO NOTHING
}
const onSearchResetClick = () => {
  searchStr.value = ''
  displayReferrals.value = referrals.value.sort((a, b) => a.CreateAt > b.CreateAt ? -1 : 1)
}

const accountName = (referral: LocalUserProductArchivement) => {
  return referral.EmailAddress?.length ? referral.EmailAddress : referral.PhoneNO
}

const joinDate = (referral: LocalUserProductArchivement) => {
  return formatTime(referral.CreateAt, true)
}

const joinTime = (referral: LocalUserProductArchivement) => {
  return formatTime(referral.CreateAt, false).split(' ')[1]
}

// const referralUnits = (referral: LocalUserProductArchivement) => {
//   const rfs = referral.Archivements.filter((el) => el.CoinTypeID === selectedCoin.value?.value.ID)
//   let units = 0
//   rfs.forEach((el) => { units += el.TotalUnits })
//   return units
// }

// const referralAmount = (referral: LocalUserProductArchivement) => {
//   const rfs = referral.Archivements.filter((el) => el.CoinTypeID === selectedCoin.value?.value.ID)
//   let amount = 0
//   rfs.forEach((el) => { amount += Number(el.TotalAmount) })
//   return amount
// }

// const referralContribution = (referral: LocalUserProductArchivement) => {
//   let commission = 0
//   const rfs = referral.Archivements.filter((el) => el.CoinTypeID === selectedCoin.value?.value.ID)
//   rfs.forEach((el) => { commission += Number(el.TotalCommission) })
//   return commission
// }

// dynamic get object attribute in typescript
function prop<T extends object, K extends keyof T> (obj: T, key: K) {
  return obj[key]
}
const getTotal = computed(() => (referral: LocalUserProductArchivement, attr: keyof LocalArchivement) => {
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

const onSetKolClick = (referral: LocalUserProductArchivement) => {
  void router.push({
    path: '/setup/affiliate',
    query: {
      userId: referral.UserID
    }
  })
}

onMounted(() => {
  // if (referrals.value.length === 0) {
  //   inspire.getReferrals({
  //     Message: {
  //       Error: {
  //         Title: t('MSG_GET_REFERRALS_FAIL'),
  //         Popup: true,
  //         Type: NotificationType.Error
  //       }
  //     }
  //   }, () => {
  //     displayReferrals.value = localArchivements.Archivements.filter((referral) => !referral.Kol)
  //     if (inspire.GoodCommissions.length === 0) {
  //       inspire.getGoodCommissions({
  //         Message: {
  //           Error: {
  //             Title: t('MSG_GET_GOOD_COMMISSIONS_FAIL'),
  //             Popup: true,
  //             Type: NotificationType.Error
  //           }
  //         }
  //       }, () => {
  //         // TODO
  //       })
  //     }
  //   })
  // }

  if (coins.value.length === 0) {
    coin.getCoins({
      Message: {
        Error: {
          Title: t('MSG_GET_COINS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
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
