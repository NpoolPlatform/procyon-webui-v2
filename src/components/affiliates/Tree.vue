<template>
  <h2>{{ $t('MSG_AFFILIATE_TREE') }}</h2>
  <div class='aff-tree'>
    <Card
      v-if='inviter'
      :child='false'
      :first-child='false'
      :last-child='false'
      :referral='inviter'
    />
    <Card
      v-for='(referral, idx) in referrals'
      :key='referral.User.ID'
      :child='true'
      :first-child='idx === 0'
      :last-child='idx === referrals.length - 1'
      :referral='referral'
    />
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { NotificationType, useInspireStore, useLoginedUserStore, Referral, useGoodStore } from 'npool-cli-v2'
import { useLocalGoodStore } from '../../localstore'
import { useI18n } from 'vue-i18n'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const referrals = computed(() => inspire.Referrals.filter((el) => el.Kol && logined.LoginedUser?.User.ID !== el.User.ID))
const inviter = computed(() => {
  const index = inspire.Referrals.findIndex((el) => el.User.ID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as Referral : inspire.Referrals[index]
})

const logined = useLoginedUserStore()
const innerLoading = ref(false)

const good = useGoodStore()
const lgood = useLocalGoodStore()

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
          lgood.Goods = []
          good.Goods.filter((el) => {
            const index = good.AppGoods.findIndex((gel) => gel.GoodID === el.Good.Good.ID && gel.Visible)
            return index >= 0
          }).forEach((el) => {
            inspire.Referrals.forEach((rel) => {
              lgood.Goods.push({
                UserID: rel.User.ID as string,
                GoodID: el.Good.Good.ID as string,
                Editing: false,
                Percent: 0
              })
            })
          })

          inspire.getPurchaseAmountSettings({
            Message: {
              Error: {
                Title: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS_FAIL'),
                Popup: true,
                Type: NotificationType.Error
              }
            }
          }, () => {
            inspire.PurchaseAmountSettings.forEach((pel) => {
              if (pel.End !== 0) {
                return
              }
              const index = lgood.Goods.findIndex((el) => el.GoodID === pel.GoodID && el.UserID === pel.UserID)
              if (index >= 0) {
                lgood.Goods[index].Percent = pel.Percent
              }
            })
          })
        })
      })
    })
  }

  if (inspire.GoodCommissions.length === 0) {
    inspire.getGoodCommissions({
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_COMMISSIONS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      // TODO
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
