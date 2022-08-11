<template>
  <FormPage @submit='onSubmit' label='MSG_SETUP_AFFILIATE' submit-text='MSG_CREATE_AFFILIATE'>
    <template #form-body>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <p class='aff-email'>
        {{ subusername }}
      </p>
      <div v-for='_good in referral.Archivements' :key='_good.CurGoodID'>
        <label>{{ _good.CurGoodName }} {{ $t('MSG_KOL_COMMISSION_RATE') }}:</label>
        <select v-model='_good.CurPercent'>
          <option v-for='kol in userKOLOptions(inviterGoodPercent(_good.CurGoodID))' :key='kol'>
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
  useLoginedUserStore,
  username as Username,
  AppUser,
  AppUserExtra,
  NotificationType,
  useGoodStore
} from 'npool-cli-v2'
import { LocalProductArchivement, useLocalArchivementStore } from 'src/localstore/affiliates'
import { defineAsyncComponent, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { locale, t } = useI18n({ useScope: 'global' })

interface Query {
  userId: string
}
const route = useRoute()
const query = computed(() => route.query as unknown as Query)

const inspire = useInspireStore()
const localArchivement = useLocalArchivementStore()
const referral = computed(() => {
  const index = localArchivement.Archivements.findIndex((el) => el.UserID === query.value.userId)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivement.Archivements[index]
})
const logined = useLoginedUserStore()
const router = useRouter()

const username = computed(() => {
  let name = referral.value.Username

  if (referral.value?.LastName?.length && referral.value?.FirstName?.length) {
    name = referral.value.LastName + ' ' + referral.value.FirstName
  }

  if (!name?.length) {
    name = referral.value?.Username
  }

  if (!name?.length) {
    name = referral.value?.EmailAddress
  }

  if (!name?.length) {
    name = referral.value?.PhoneNO
  }

  return name
})

const inviter = computed(() => {
  const index = localArchivement.Archivements.findIndex((el) => el.UserID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as LocalProductArchivement : localArchivement.Archivements[index]
})

const userKOLOptions = computed(() => (maxKOL: number) => {
  const kolList = [30, 25, 15, 10, 5, 0]
  let index = kolList.findIndex(kol => kol <= maxKOL)
  return index === kolList.length - 1 || index === -1 ? [0] : kolList.splice(++index)
})
const inviterGoodPercent = (goodID: string) => {
  const good = inviter.value.Archivements.find((el) => el.CurGoodID === goodID)
  return good === undefined ? 0 : good.CurPercent
}

const subusername = computed(() => {
  let name = referral.value.EmailAddress

  if (!name?.length) {
    name = referral.value?.PhoneNO
  }

  return name
})

const backTimer = ref(-1)

const onSubmit = () => {
  let overflow = false
  for (const g of referral.value.Archivements) {
    if (g.CurPercent > inviterGoodPercent(g.CurGoodID)) {
      g.CurPercent = inviterGoodPercent(g.CurGoodID)
      overflow = true
    }
  }

  if (overflow) {
    return
  }

  inspire.createInvitationCode({
    TargetUserID: referral.value.UserID,
    InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
    InviteeName: Username(referral.value, {
      FirstName: referral.value.FirstName,
      LastName: referral.value.LastName,
      IDNumber: ''
    },
    locale.value) as string,
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
  }, () => {
    // TODO
  })

  referral.value.Archivements.forEach((good) => {
    inspire.createPurchaseAmountSetting({
      TargetUserID: referral.value.UserID,
      InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
      InviteeName: Username(referral.value, {
        FirstName: referral.value.FirstName,
        LastName: referral.value.LastName,
        IDNumber: ''
      }, locale.value) as string,
      Info: {
        GoodID: good.CurGoodID,
        Percent: good.CurPercent,
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
}

const good = useGoodStore()

onMounted(() => {
  good.getGoods({
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    good.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
})

</script>

<style lang='sass' scoped>
</style>
