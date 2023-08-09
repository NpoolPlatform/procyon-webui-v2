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
          v-model:percent='_good.CommissionPercent' :max='getGoodPercent(_good.GoodID)' ignore-style
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

const _archivement = achievement.useAchievementStore()
const referral = computed(() => _archivement.achievement(query.value?.userID))

const baseUser = useBaseUserStore()
const username = computed(() => baseUser.displayName({
  FirstName: referral.value?.FirstName,
  LastName: referral.value?.LastName
} as User, locale.value as string))
const subUsername = computed(() => referral.value?.EmailAddress?.length ? referral.value?.EmailAddress : referral.value?.PhoneNO)

const logined = useLocalUserStore()

const good = useAdminAppGoodStore()
const getGoodPercent = computed(() => (goodID: string) => {
  return _archivement.inviterGoodPercent(logined?.User.ID, goodID) as number
})

const visibleGoodAchievements = computed(() => referral.value?.Achievements?.filter((el) => good.visible(el.GoodID)))

const backTimer = ref(-1)
const submitting = ref(false)

const user = useFrontendUserStore()
const _commission = commission.useCommissionStore()
const onSubmit = () => {
  submitting.value = true
  referral.value?.Achievements?.forEach((g) => {
    if (g.CommissionPercent > getGoodPercent.value(g.GoodID)) {
      g.CommissionPercent = getGoodPercent.value(g.GoodID)
    }
    if (g.CommissionPercent < 0) {
      g.CommissionPercent = 0
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
      _archivement.$reset()
      void router.push({ path: '/affiliates' })
      return
    }

    visibleGoodAchievements?.value?.forEach((row) => {
      const myCommission = _commission.Commissions.find((el) => el.GoodID === row.GoodID && el.SettleType === commission.SettleType.GoodOrderPayment)
      if (!myCommission) {
        return
      }
      _commission.createCommission({
        TargetUserID: referral.value?.UserID as string,
        GoodID: row.GoodID,
        SettleType: commission.SettleType.GoodOrderPayment,
        SettleAmountType: myCommission.SettleAmountType,
        SettleMode: myCommission.SettleMode,
        AmountOrPercent: `${row.CommissionPercent}`,
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
          _archivement.$reset()
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
  if (_archivement.Achievements.length === 0) {
    getAchievements(0, 100)
  }
})

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
</script>

<style lang='sass' scoped>
</style>
