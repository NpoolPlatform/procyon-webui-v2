<template>
  <div class='content' v-if='user.isKol'>
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
import { useLocalUserStore, useAdminAppGoodStore, NotifyType, AppGood, useAdminAppCoinStore, useAdminFiatCurrencyStore, FiatType } from 'npool-cli-v4'
import { QAjaxBar } from 'quasar'
import { getCoins } from 'src/api/chain'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { commission, achievement } from 'src/teststore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CommissionCard = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const user = useLocalUserStore()
const _archivement = achievement.useAchievementStore()
const good = useAdminAppGoodStore()
const coin = useAdminAppCoinStore()
const fiat = useAdminFiatCurrencyStore()

const _commission = commission.useCommissionStore()
onMounted(() => {
  if (_archivement.Achievements.length === 0) {
    getAchievements(0, 100)
  }
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (coin.AppCoins.AppCoins.length === 0) {
    getCoins(0, 100)
  }

  if (fiat.CoinFiatCurrencies.CoinFiatCurrencies.length === 0) {
    getFiatCurrency()
  }
  if (_commission.Commissions.length === 0) {
    getCommissions(0, 100)
  }
})

const getAppGoods = (offset: number, limit: number) => {
  good.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_APP_GOODS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (g: Array<AppGood>, error: boolean) => {
    if (error || g.length < limit) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
const getAchievements = (offset: number, limit: number) => {
  _archivement.getAchievements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COIN_ARCHIVEMENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
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
  fiat.getFiatCurrency({
    FiatName: FiatType.JPY,
    Message: {
    }
  }, () => {
    // TODO
  })
}

const getCommissions = (offset: number, limit: number) => {
  _commission.getCommissions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
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
