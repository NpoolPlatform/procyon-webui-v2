<template>
  <h2>{{ $t('MSG_AFFILIATE_TREE') }}</h2>
  <q-tree
    v-if='referralTree'
    :nodes='referralTree'
    node-key='UserID'
    default-expand-all
    :expanded='[logined.LoginedUser?.User.ID]'
  >
    <template #default-header='props'>
      <div v-if='props.node.Referral.Kol'>
        <div class='content-glass'>
          <div class='invitation-header referral row'>
            <h3>
              {{ props.node.Referral.Extra ? props.node.Referral.Extra.Username : props.node.Referral.User?.EmailAddress }}
            </h3>
            <q-space />
            <span class='onboard'>{{ $t('MSG_ONBOARD') }}</span>
            <span class='invited-count'>{{ props.node.Referral.InvitedCount }}</span>
          </div>
          <span class='username'>{{ props.node.Referral.User?.EmailAddress }}</span>
          <div class='invitation-content'>
            <div v-for='summary in props.node.Referral.Summaries' :key='summary.CoinTypeID'>
              <span>{{ summary.CoinName }}: </span>
              <span class='sales-number'>{{ summary.Units }}</span>
              <span> {{ summary.Unit }} / </span>
              <span class='sales-number'>{{ Math.floor(summary.Amount) }}</span>
              <span> {{ PriceCoinName }}</span>
            </div>
          </div>
        </div>
        <q-inner-loading dark :showing='innerLoading' v-if='logined.LoginedUser?.User.ID === props.node.UserID'>
          <q-spinner-gears size='50px' color='primary' />
        </q-inner-loading>
      </div>
    </template>
  </q-tree>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NotificationType, useInspireStore, buildReferralTree, useLoginedUserStore, PriceCoinName } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const referralTree = computed(() => buildReferralTree(inspire.Referrals.filter((el) => el.Kol)))

const logined = useLoginedUserStore()
const innerLoading = ref(false)

onMounted(() => {
  if (inspire.Referrals.length === 0) {
    innerLoading.value = true
    inspire.getReferrals({
      Message: {
        Error: {
          Title: t('MSG_GET_REFERRALS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      innerLoading.value = false
    })
  }
})

</script>

<stype lang='sass' scoped>
h3
  font-size: 20px !important
  font-weight: 600 !important
  padding: 0 !important
  color: white !important
  margin-top: 0 !important
  line-height: 1.6em !important
  border-bottom: solid 1px linear-gradient(to right, transparent 0, #e1eeef 10%, transparent 30%)

.referral
  min-width: 400px

.invited-count
  background: linear-gradient(to left, #54e280 0, #1ec498 50%)
  background-clip: border-box
  filter: contrast(2)
  font-size: 20px
  font-weight: bold
  -webkit-background-clip: text
  -webkit-box-decoration-break: clone
  -webkit-text-fill-color: transparent

.onboard
  font-size: 14px
  font-weight: 300
  margin-right: 5px
  margin-top: 6px

.invitation-content
  margin-top: 10px

.username
  font-size: 20px
  font-weight: 600

.sales-number
  color: white
  font-weight: bold
  font-size: 20px
</stype>
