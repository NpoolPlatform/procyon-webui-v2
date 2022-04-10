<template>
  <h2>{{ $t('MSG_AFFILIATE_TREE') }}</h2>
  <q-tree
    :nodes='referralTree'
    node-key='UserID'
    default-expand-all :expanded='[logined.LoginedUser?.User.ID]'>
    <template #default-header='prop'>
      <div class='invitation-box'>
        <div class='invitation-header'>
          <div class='header-content row'>
            <span style='font-size: 20px; font-weight: 600;'>
              {{ prop.node.Referral.Extra ? prop.node.Referral.Extra.Username : prop.node.Referral.User?.EmailAddress }}
            </span>
            <q-space />
            <span
              style='font-size: 14px; font-weight: 300; margin-right: 5px; margin-top: 6px;'
            >
              {{ $t('affiliate.OnBoarded') }}
            </span>
            <span class='invited-count'>{{ prop.node.InvitedCount }}</span>
          </div>
        </div>

        <div class='invitation-content'>
          <span>{{ prop.node.Referral.User?.EmailAddress }}</span>
        </div>

        <div class='invitation-content'>
          <div v-for='summary in prop.node.Referral.Summaries' :key='summary.CoinTypeID'>
            <span>{{ summary.CoinName }}: </span>
            <span class='sales-number'>{{ summary.Units }}</span>
            <span> {{ summary.Unit }} / </span>
            <span class='sales-number'>{{ Math.floor(summary.Amount) }}</span>
            <span> USDT</span>
          </div>
        </div>
      </div>
      <q-inner-loading dark :showing='innerLoading' v-if='userInfo.User.ID === prop.node.UserID'>
        <q-spinner-gears size='50px' color='primary' />
      </q-inner-loading>
    </template>
  </q-tree>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NotificationType, useInspireStore, buildReferralTree, useLoginedUserStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const referralTree = computed(() => buildReferralTree(inspire.Referrals))

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
</stype>
