<template>
  <FormPage @submit='onSubmit' label='MSG_SETUP_AFFILIATE' submit-text='MSG_CREATE_AFFILIATE'>
    <template #form-body>
      <h3 class='aff-name'>
        {{ username }}
      </h3>
      <p class='aff-email'>
        {{ subusername }}
      </p>
      <div v-for='_good in goods' :key='_good.GoodID'>
        <label>{{ good.getGoodByID(_good.GoodID)?.Main?.Name }} {{ $t('MSG_COMMISSION_RATE') }}:</label>
        <input type='number' v-model='_good.Percent'>
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
  Referral,
  useInspireStore,
  useLoginedUserStore,
  username as Username,
  AppUser,
  AppUserExtra,
  NotificationType,
  useGoodStore
} from 'npool-cli-v2'
import { GoodItem } from 'src/localstore'
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
const referral = computed(() => {
  const index = inspire.Referrals.findIndex((el) => el.User.ID === query.value.userId)
  return index < 0 ? undefined as unknown as Referral : inspire.Referrals[index]
})
const logined = useLoginedUserStore()
const router = useRouter()

const username = computed(() => {
  let name = referral.value?.Extra?.Username

  if (referral.value?.Extra?.LastName?.length && referral.value?.Extra?.FirstName?.length) {
    name = referral.value?.Extra?.LastName + ' ' + referral.value?.Extra?.FirstName
  }

  if (!name?.length) {
    name = referral.value?.Extra?.Username
  }

  if (!name?.length) {
    name = referral.value?.User?.EmailAddress
  }

  if (!name?.length) {
    name = referral.value?.User?.PhoneNO
  }

  return name
})

const subusername = computed(() => {
  let name = referral.value?.User?.EmailAddress

  if (!name?.length) {
    name = referral.value?.User?.PhoneNO
  }

  return name
})

const backTimer = ref(-1)

const onSubmit = () => {
  inspire.createInvitationCode({
    TargetUserID: referral.value.User.ID as string,
    InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
    InviteeName: Username(referral.value.User, referral.value.Extra, locale.value) as string,
    Info: {
      UserID: referral.value.User.ID
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    inspire.getReferrals({
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  })

  goods.value.forEach((good) => {
    if (backTimer.value >= 0) {
      window.clearTimeout(backTimer.value)
    }
    inspire.createPurchaseAmountSetting({
      TargetUserID: referral.value.User.ID as string,
      InviterName: Username(logined.LoginedUser?.User as AppUser, logined.LoginedUser?.Extra as AppUserExtra, locale.value) as string,
      InviteeName: Username(referral.value.User, referral.value.Extra, locale.value) as string,
      Info: {
        GoodID: good.GoodID,
        Percent: good.Percent,
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
      backTimer.value = window.setTimeout(() => {
        void router.back()
      }, 1000)
    })
  })
}

const good = useGoodStore()
const goods = ref([] as Array<GoodItem>)

onMounted(() => {
  if (inspire.Referrals.length === 0) {
    inspire.getReferrals({
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
    })
  }

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
      good.Goods.filter((el) => {
        const index = good.AppGoods.findIndex((gel) => gel.GoodID === el.Good.Good.ID && gel.Visible && gel.Online)
        return index >= 0
      }).forEach((el) => {
        const index = goods.value.findIndex((lel) => lel.GoodID === el.Good.Good.ID)
        if (index >= 0) {
          return
        }
        goods.value.push({
          UserID: referral.value.User.ID as string,
          GoodID: el.Good.Good.ID as string,
          Editing: false,
          Percent: 0
        })
      })
    })
  })
})

</script>

<style lang='sass' scoped>
</style>
