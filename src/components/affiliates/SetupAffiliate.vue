<template>
  <FormPage @submit='onSubmit' label='MSG_SETUP_AFFILIATE' submit-text='MSG_CREATE_AFFILIATE' :submitting='submitting'>
    <template #form-body>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <p class='aff-email'>
        {{ subUsername }}
      </p>
      <div v-for='(_good, idx) in visibleGoodArchivements' :key='idx'>
        <label>{{ _good.GoodName }} {{ $t('MSG_KOL_COMMISSION_RATE') }}:</label>
        <KolOption v-model:percent='_good.CommissionPercent' :max='getGoodPercent(_good.GoodID)' ignore-style />
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
  useFrontendArchivementStore,
  UserArchivement,
  NotifyType,
  useFrontendUserStore,
  SettleType,
  useFrontendCommissionStore
} from 'npool-cli-v4'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getAppGoods } from 'src/api/good'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const KolOption = defineAsyncComponent(() => import('src/components/affiliates/KolOption.vue'))

interface Query {
  userID: string;
}

const route = useRoute()
const router = useRouter()
const query = computed(() => route.query as unknown as Query)

const archivement = useFrontendArchivementStore()
const referral = computed(() => archivement.getArchivementByUserID(query.value?.userID))

const baseUser = useBaseUserStore()
const username = computed(() => baseUser.displayName({
  FirstName: referral.value?.FirstName,
  LastName: referral.value?.LastName
} as User, locale.value as string))
const subUsername = computed(() => archivement.subUsername(referral.value as UserArchivement))

const logined = useLocalUserStore()

const good = useAdminAppGoodStore()
const getGoodPercent = computed(() => (goodID: string) => {
  const inviterArchivement = archivement.getArchivementByUserID(logined?.User.ID)
  return archivement.getInviterGoodPercent(inviterArchivement as UserArchivement, goodID)
})

const visibleGoodArchivements = computed(() => referral.value?.Archivements?.filter((el) => good.visible(el.GoodID)))

const backTimer = ref(-1)
const submitting = ref(false)

const user = useFrontendUserStore()
const commission = useFrontendCommissionStore()
const onSubmit = () => {
  submitting.value = true
  referral.value?.Archivements?.forEach((g) => {
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
    if (visibleGoodArchivements.value?.length === 0) {
      archivement.$reset()
      void router.push({ path: '/affiliates' })
      return
    }
    visibleGoodArchivements?.value?.forEach((row) => {
      commission.createCommission({
        TargetUserID: referral.value?.UserID as string,
        GoodID: row.GoodID,
        SettleType: good.settleType(row.GoodID) as SettleType,
        Value: `${row.CommissionPercent}`,
        StartAt: Math.ceil(Date.now() / 1000),
        Message: {
          Error: {
            Title: t('MSG_CREATE_AMOUNT_SETTING_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
        if (backTimer.value >= 0) {
          window.clearTimeout(backTimer.value)
        }
        backTimer.value = window.setTimeout(() => {
          archivement.$reset()
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
  if (archivement.Archivements.Archivements.length === 0) {
    getArchivements(0, 100)
  }
})

const getArchivements = (offset: number, limit: number) => {
  archivement.getGoodArchivements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COIN_ARCHIVEMENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<UserArchivement>) => {
    if (error || rows.length < limit) {
      return
    }
    getArchivements(offset + limit, limit)
  })
}
</script>

<style lang='sass' scoped>
</style>
