<template>
  <FormPage @submit='onSubmit' label='MSG_SETUP_AFFILIATE' submit-text='MSG_CREATE_AFFILIATE'>
    <template #form-body>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <p class='aff-email'>
        {{ subusername }}
      </p>
      <div v-for='(_good, idx) in visibleGoodsArchivements(referral?.Archivements)' :key='idx'>
        <label>{{ _good.GoodName }} {{ $t('MSG_KOL_COMMISSION_RATE') }}:</label>
        <select v-model='_good.CommissionPercent'>
          <option v-for='kol in userKOLOptions(inviterGoodPercent(_good.GoodID))' :key='kol'>
            {{ kol }}
          </option>
        </select>
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
  useInspireStore,
  NotificationType
} from 'npool-cli-v2'
import { useLocalUserStore, useBaseUserStore, User, useAdminAppGoodStore, NotifyType, AppGood } from 'npool-cli-v4'
import { LocalArchivement, LocalProductArchivement, useLocalArchivementStore } from 'src/localstore/affiliates'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

interface Query {
  userId: string;
}
const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const inspire = useInspireStore()
const localArchivement = useLocalArchivementStore()
const referral = computed(() => {
  const index = localArchivement.Archivements.findIndex((el) => el.UserID === query.value.userId)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivement.Archivements[index]
})

const logined = useLocalUserStore()
const baseuser = useBaseUserStore()
const router = useRouter()

const username = computed(() => baseuser.displayName({
  FirstName: referral.value?.FirstName,
  LastName: referral.value?.LastName
} as User, locale.value as string))

const inviter = computed(() => {
  const index = localArchivement.Archivements.findIndex((el) => el.UserID === logined.User.ID)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivement.Archivements[index]
})

const userKOLOptions = computed(() => (maxKOL: number) => {
  const kolList = [30, 25, 15, 10, 5, 0]
  let index = kolList.findIndex(kol => kol <= maxKOL)
  return index === kolList.length - 1 || index === -1 ? [0] : kolList.splice(++index)
})

const inviterGoodPercent = (goodID: string) => {
  const good = inviter.value.Archivements.find((el) => el.GoodID === goodID)
  return good === undefined ? 0 : good.CommissionPercent
}

const good = useAdminAppGoodStore()

const visibleGoodsArchivements = computed(() => (goodArchivements: Array<LocalArchivement>) => {
  return goodArchivements.filter((el) => good.visible(el.GoodID))
})

const subusername = computed(() => {
  let name = referral.value?.EmailAddress

  if (!name?.length) {
    name = referral.value?.PhoneNO
  }

  return name
})

const backTimer = ref(-1)

const onSubmit = () => {
  let overflow = false
  for (const g of referral.value?.Archivements) {
    if (g.CommissionPercent > inviterGoodPercent(g.GoodID)) {
      g.CommissionPercent = inviterGoodPercent(g.GoodID)
      overflow = true
    }
  }

  if (overflow) {
    return
  }

  inspire.createInvitationCode({
    TargetUserID: referral.value?.UserID,
    InviterName: baseuser.displayName(logined.User, locale.value as string),
    InviteeName: username.value,
    Info: {
      UserID: referral.value.UserID
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    visibleGoodsArchivements.value(referral.value?.Archivements).forEach((good) => {
      inspire.createPurchaseAmountSetting({
        TargetUserID: referral.value?.UserID,
        InviterName: baseuser.displayName(logined.User, locale.value as string),
        InviteeName: username.value,
        Info: {
          GoodID: good.GoodID,
          CoinTypeID: good.CoinTypeID,
          Percent: good.CommissionPercent,
          Start: Math.ceil(Date.now() / 1000),
          End: 0
        },
        Message: {
          Error: {
            Title: t('MSG_CREATE_AMOUNT_SETTING_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        if (backTimer.value >= 0) {
          window.clearTimeout(backTimer.value)
        }
        backTimer.value = window.setTimeout(() => {
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
</script>

<style lang='sass' scoped>
</style>
