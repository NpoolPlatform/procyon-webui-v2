<template>
  <FormPage @submit='onSubmit' label='MSG_SETUP_AFFILIATE' submit-text='MSG_CREATE_AFFILIATE' :submitting='submitting'>
    <template #form-body>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <p class='aff-email'>
        {{ subUsername }}
      </p>
      <div v-for='(_good, idx) in visibleGoodAchievements' :key='idx'>
        <label>{{ _good.GoodName }} {{ $t('MSG_KOL_COMMISSION_RATE') }}:</label>
        <KolOption
          v-model:percent='_good.CommissionValue' :max='getGoodCommissionValue(_good.GoodID)' ignore-style
          :disabled='!good.haveSale(good.getGoodByID(_good.GoodID) as AppGood)'
        />
      </div>
    </template>
    <template #append-submit>
      <h3>{{ $t('MSG_INFO') }}</h3>
      <p v-html='$t("MSG_SETUP_AFFILIATE_INFO")' />
    </template>
  </FormPage>
</template>

<script setup lang='ts'>
import {
  useLocalUserStore,
  useBaseUserStore,
  User,
  useAdminAppGoodStore,
  NotifyType,
  useFrontendUserStore,
  AppGood
} from 'npool-cli-v4'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getAppGoods } from 'src/api/good'
import { commission, achievement } from 'src/teststore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const KolOption = defineAsyncComponent(() => import('src/components/affiliates/KolOption.vue'))

interface Query {
  userID: string
}

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query as unknown as Query)

const _achievement = achievement.useAchievementStore()
const referral = computed(() => _achievement.achievement(query.value?.userID))

const baseUser = useBaseUserStore()
const username = computed(() => baseUser.displayName({
  FirstName: referral.value?.FirstName,
  LastName: referral.value?.LastName
} as User, locale.value as string))
const subUsername = computed(() => referral.value?.EmailAddress?.length ? referral.value?.EmailAddress : referral.value?.PhoneNO)

const logined = useLocalUserStore()

const good = useAdminAppGoodStore()
const getGoodCommissionValue = computed(() => (goodID: string) => {
  return Number(_achievement.inviterGoodCommissionValue(logined?.User.ID, goodID))
})
const getGoodCommissionSettleMode = computed(() => (goodID: string) => {
  return _achievement.inviterGoodCommissionSettleMode(logined?.User.ID, goodID) as commission.SettleMode
})
const getGoodCommissionSettleAmountType = computed(() => (goodID: string) => {
  return _achievement.inviterGoodCommissionSettleAmountType(logined?.User.ID, goodID) as commission.SettleAmountType
})
const getGoodCommissionSettleInterval = computed(() => (goodID: string) => {
  return _achievement.inviterGoodCommissionSettleInterval(logined?.User.ID, goodID) as commission.SettleInterval
})
const getGoodCommissionThreshold = computed(() => (goodID: string) => {
  return _achievement.inviterGoodCommissionThreshold(logined?.User.ID, goodID)
})

const visibleGoodAchievements = computed(() => referral.value?.Achievements?.filter((el) => good.visible(el.GoodID)))

const backTimer = ref(-1)
const submitting = ref(false)

const user = useFrontendUserStore()
const _commission = commission.useCommissionStore()
const onSubmit = () => {
  submitting.value = true
  referral.value?.Achievements?.forEach((g) => {
    if (Number(g.CommissionValue) > getGoodCommissionValue.value(g.GoodID)) {
      g.CommissionValue = getGoodCommissionValue.value(g.GoodID).toString()
    }
    if (Number(g.CommissionValue) < 0) {
      g.CommissionValue = '0'
    }
  })

  user.updateUserKol({
    TargetUserID: referral.value?.UserID as string,
    Kol: true,
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    if (visibleGoodAchievements.value?.length === 0) {
      _achievement.$reset()
      void router.push({ path: '/affiliates' })
      return
    }

    visibleGoodAchievements?.value?.forEach((row) => {
      switch (getGoodCommissionSettleAmountType.value(row.GoodID)) {
        case commission.SettleAmountType.SettleByAmount:
          break
        case commission.SettleAmountType.SettleByPercent:
          break
        default:
          return
      }
      _commission.createCommission({
        TargetUserID: referral.value?.UserID as string,
        GoodID: row.GoodID,
        SettleType: commission.SettleType.GoodOrderPayment,
        SettleAmountType: getGoodCommissionSettleAmountType.value(row.GoodID),
        SettleMode: getGoodCommissionSettleMode.value(row.GoodID),
        SettleInterval: getGoodCommissionSettleInterval.value(row.GoodID),
        Threshold: getGoodCommissionThreshold.value(row.GoodID),
        AmountOrPercent: `${row.CommissionValue}`,
        StartAt: Math.ceil(Date.now() / 1000),
        Message: {
          Error: {
            Title: t('MSG_CREATE_COMMISSION_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
        if (backTimer.value >= 0) {
          window.clearTimeout(backTimer.value)
        }
        backTimer.value = window.setTimeout(() => {
          _achievement.$reset()
          void router.push({ path: '/affiliates' })
        }, 1000)
      })
    })
  })
}

onMounted(() => {
  if (good.AppGoods.AppGoods.length === 0) {
    getAppGoods(0, 500)
  }
  if (_achievement.Achievements.length === 0) {
    getAchievements(0, 100)
  }
})

const getAchievements = (offset: number, limit: number) => {
  _achievement.getAchievements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COIN_ACHIEVEMENT_FAIL'),
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
</script>

<style lang='sass' scoped>
</style>
