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
      :key='referral.UserID'
      :child='true'
      :first-child='idx === 0'
      :last-child='idx === referrals.length - 1'
      :referral='referral'
    />
    <q-ajax-bar
      ref='progress'
      position='top'
      color='green-2'
      size='6px'
      skip-hijack
    />
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { NotificationType, useInspireStore, useLoginedUserStore, useGoodStore } from 'npool-cli-v2'
import { useLocalGoodStore } from '../../localstore'
import { useI18n } from 'vue-i18n'
import { QAjaxBar } from 'quasar'
import { LocalUserProductArchivement } from 'src/localstore/affiliates/types'
import { useLocalArchivementStore } from 'src/localstore/affiliates'

const Card = defineAsyncComponent(() => import('src/components/affiliates/Card.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const inspire = useInspireStore()
const logined = useLoginedUserStore()
const localArchivements = useLocalArchivementStore()

const referrals = computed(() => localArchivements.Archivements.filter((el) => el.Kol && logined.LoginedUser?.User.ID !== el.UserID))
const inviter = computed(() => {
  const index = localArchivements.Archivements.findIndex((el) => el.UserID === logined.LoginedUser?.User.ID)
  return index < 0 ? undefined as unknown as LocalUserProductArchivement : localArchivements.Archivements[index]
})

const good = useGoodStore()
const lgood = useLocalGoodStore()

const progress = ref<QAjaxBar>()

onMounted(() => {
  if (inspire.GoodCommissions.length === 0) {
    progress.value?.start()

    inspire.getGoodCommissions({
      Message: {
        Error: {
          Title: t('MSG_GET_GOOD_COMMISSIONS_FAIL'),
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
      }, (error: boolean) => {
        progress.value?.stop()
        if (error) {
          return
        }

        progress.value?.start()

        good.getGoods({
          Message: {
            Error: {
              Title: t('MSG_GET_GOODS_FAIL'),
              Popup: true,
              Type: NotificationType.Error
            }
          }
        }, (error: boolean) => {
          progress.value?.stop()
          if (error) {
            return
          }

          progress.value?.start()

          good.getAppGoods({
            Message: {
              Error: {
                Title: t('MSG_GET_APP_GOODS_FAIL'),
                Popup: true,
                Type: NotificationType.Error
              }
            }
          }, (error: boolean) => {
            progress.value?.stop()
            if (error) {
              return
            }

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

            progress.value?.start()

            inspire.getPurchaseAmountSettings({
              Message: {
                Error: {
                  Title: t('MSG_GET_PURCHASE_AMOUNT_SETTINGS_FAIL'),
                  Popup: true,
                  Type: NotificationType.Error
                }
              }
            }, () => {
              progress.value?.stop()

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
    })
  }
})
</script>
