<template>
  <div class='content' v-if='logined.isKol'>
    <CommissionCard />
    <div class='hr' />
    <ReferralCode />
    <div class='hr' />
    <Tree />
    <div class='hr' />
    <Table />
    <div class='hr' />
  </div>
  <q-ajax-bar ref='progress' position='top' color='green-2' size='6px' />
</template>

<script setup lang='ts'>
import { QAjaxBar } from 'quasar'
import { getCoins } from 'src/api/chain'
import { defineAsyncComponent, onMounted } from 'vue'
import { commission, achievement, user, appgood, notify, appcoin, fiatcurrency, fiat } from 'src/npoolstore'

const CommissionCard = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const logined = user.useLocalUserStore()
const _achievement = achievement.useAchievementStore()
const good = appgood.useAppGoodStore()
const coin = appcoin.useAppCoinStore()
const _fiatcurrency = fiatcurrency.useFiatCurrencyStore()

const _commission = commission.useCommissionStore()
onMounted(() => {
  if (!_achievement.achievements(undefined, logined.loginedUserID).length) {
    getAchievements(0, 100)
  }
  if (!good.goods(undefined).length) {
    getAppGoods(0, 100)
  }
  if (!coin.coins(undefined).length) {
    getCoins(0, 100)
  }

  if (!_fiatcurrency.currencies().length) {
    getFiatCurrency()
  }
  if (!_commission.commissions(undefined, logined.loginedUserID).length) {
    getCommissions(0, 100)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, g?: Array<appgood.Good>) => {
    if (error || !g?.length) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
const getAchievements = (offset: number, limit: number) => {
  _achievement.getAchievements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_ACHIEVEMENT',
        Message: 'MSG_GET_COIN_ACHIEVEMENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<achievement.Achievement>) => {
    if (error || !rows?.length) {
      return
    }
    getAchievements(offset + limit, limit)
  })
}

const getFiatCurrency = () => {
  _fiatcurrency.getFiatCurrency({
    FiatName: fiat.FiatType.JPY
  }, () => {
    // TODO
  })
}

const getCommissions = (offset: number, limit: number) => {
  _commission.getCommissionHistories({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COMMISSIONS',
        Message: 'MSG_GET_COMMISSIONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<commission.Commission>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCommissions(offset + limit, limit)
  })
}
</script>
