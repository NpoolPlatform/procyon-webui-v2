<template>
  <div class='content' v-if='inspire.InvitationCode?.InvitationCode?.length'>
    <Commission />
    <div class='hr' />
    <ReferralCode />
    <div class='hr' />
    <Tree />
    <div class='hr' />
    <Table />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { NotificationType, useGoodStore, useInspireStore } from 'npool-cli-v2'
import { useArchivementStore } from 'src/teststore/mock/archivement'
import { defineAsyncComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalArchivementStore } from 'src/localstore/affiliates'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Commission = defineAsyncComponent(() => import('src/components/affiliates/Commission.vue'))
const ReferralCode = defineAsyncComponent(() => import('src/components/affiliates/ReferralCode.vue'))
const Tree = defineAsyncComponent(() => import('src/components/affiliates/Tree.vue'))
const Table = defineAsyncComponent(() => import('src/components/affiliates/Table.vue'))

const localArchivements = useLocalArchivementStore()
const archivement = useArchivementStore()
const getArchivements = (offset: number, limit: number) => {
  archivement.getCoinArchivements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_GOODS_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    if (offset + limit >= archivement.Total) { // local
      localArchivements.$reset()
      localArchivements.Total = archivement.Total
      localArchivements.addArchivement(archivement.Archivements)
      return
    }
    console.log('getCoinArchivements: again')
    getArchivements(offset + limit, limit) // recursive get archivement
  })
}

const inspire = useInspireStore()
const good = useGoodStore()
onMounted(() => {
  if (!inspire.InvitationCode?.InvitationCode?.length) {
    inspire.getInvitationCode({
      Message: {
        Error: {
          Title: t('MSG_GET_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
  }
  archivement.$reset() // call reset method before request
  getArchivements(0, 100)
  // localArchivements.Total = 10
  // localArchivements.Archivements = [
  //   {
  //     UserID: 'ad19645f-8244-44da-b231-3843c524548b',
  //     Username: '',
  //     EmailAddress: 'referraltest103@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: false,
  //     TotalInvitees: 0,
  //     CreateAt: 1655470394,
  //     Archivements: []
  //   },
  //   {
  //     UserID: 'de11ffea-b973-4d47-a6d5-a28c7f5f3762',
  //     Username: '',
  //     EmailAddress: 'referraltest0001@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: false,
  //     TotalInvitees: 0,
  //     CreateAt: 1655715898,
  //     Archivements: [
  //       {
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233',
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 1,
  //         TotalAmount: '799.0987620000001',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CurPercent: 5,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: 'ef9ba3a5-b3f6-4de3-8759-006b1163b6c4',
  //     Username: '',
  //     EmailAddress: 'referraltest06302@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: true,
  //     TotalInvitees: 0,
  //     CreateAt: 1656573929,
  //     Archivements: [
  //       {
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233',
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 1,
  //         TotalAmount: '799.0987620000001',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CurPercent: 5,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       },
  //       {
  //         CurGoodID: '19f31fb6-32a8-436d-b52d-5967119554ec',
  //         CoinTypeID: 'cf3784fe-724e-4db2-95f8-ac4b4b894459',
  //         CoinName: 'BTC',
  //         TotalUnits: 2,
  //         TotalAmount: '200.044245',
  //         CoinUnit: 'TiB',
  //         CurPercent: 5,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: '5ec833b0-9226-480e-a3c7-2d77632d5ef4',
  //     Username: '12313',
  //     EmailAddress: 'referraltest@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '12311',
  //     LastName: '1',
  //     Kol: true,
  //     TotalInvitees: 8,
  //     CreateAt: 1656573930,
  //     Archivements: [
  //       {
  //         CoinTypeID: 'cf3784fe-724e-4db2-95f8-ac4b4b894459',
  //         CoinName: 'BTC',
  //         TotalUnits: 43,
  //         TotalAmount: '3320.7173540000003',
  //         CoinUnit: 'TiB',
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '12',
  //         CurGoodName: 'name',
  //         Editing: false,
  //         CurPercent: 10,
  //         CurGoodID: '19f31fb6-32a8-436d-b52d-5967119554ec'
  //       },
  //       {
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 6,
  //         TotalAmount: '4798.393195999999',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false,
  //         CurPercent: 10,
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233'
  //       }
  //     ]
  //   },
  //   {
  //     UserID: '70335611-b09e-4aef-903a-f580770ae3fa',
  //     Username: 'tanghong',
  //     EmailAddress: 'catwo222@163.com',
  //     PhoneNO: '+8613564039586',
  //     FirstName: '1',
  //     LastName: '1',
  //     Kol: true,
  //     TotalInvitees: 2,
  //     CreateAt: 1655479280,
  //     Archivements: [
  //       {
  //         CurGoodID: '19f31fb6-32a8-436d-b52d-5967119554ec',
  //         CoinTypeID: 'cf3784fe-724e-4db2-95f8-ac4b4b894459',
  //         CoinName: 'BTC',
  //         TotalUnits: 17,
  //         TotalAmount: '1702.430719',
  //         CoinUnit: 'TiB',
  //         CurPercent: 0,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       },
  //       {
  //         CurGoodID: 'ac82767b-2d1e-4562-ab7e-a8158564b3a5',
  //         CoinTypeID: '2a22d3b8-d082-4a18-a1a3-31ac8cfa1ffb',
  //         CoinName: 'BTC',
  //         TotalUnits: 2,
  //         TotalAmount: '10.02197',
  //         CoinUnit: 'TiB',
  //         CurPercent: 0,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: '2f57fed8-8973-4a5f-b709-c22493a241ff',
  //     Username: '',
  //     EmailAddress: 'referraltest101@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: true,
  //     TotalInvitees: 1,
  //     CreateAt: 1655467335,
  //     Archivements: [
  //       {
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233',
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 1,
  //         TotalAmount: '799.8367999999999',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CurPercent: 5,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: '37f4d54c-dd24-46a5-8de3-543cc4581a6e',
  //     Username: '',
  //     EmailAddress: 'referraltest104@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: true,
  //     TotalInvitees: 0,
  //     CreateAt: 1655474792,
  //     Archivements: [
  //       {
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233',
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 1,
  //         TotalAmount: '799.8367999999999',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CurPercent: 5,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: '84ba314a-d930-4a38-b913-69abd1105cfe',
  //     Username: '',
  //     EmailAddress: 'referraltest0630@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: true,
  //     TotalInvitees: 0,
  //     CreateAt: 1656571156,
  //     Archivements: [
  //       {
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233',
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 2,
  //         TotalAmount: '1598.1081339999998',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CurPercent: 0,
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false
  //       }
  //     ]
  //   },
  //   {
  //     UserID: 'df9be569-208b-4612-b6ae-88acf0511561',
  //     Username: '',
  //     EmailAddress: 'referraltest102@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '',
  //     LastName: '',
  //     Kol: true,
  //     TotalInvitees: 0,
  //     CreateAt: 1655468723,
  //     Archivements: []
  //   },
  //   {
  //     UserID: '5ec833b0-9226-480e-a3c7-2d77632d5ef4',
  //     Username: '12313',
  //     EmailAddress: 'referraltest@npool.cc',
  //     PhoneNO: '',
  //     FirstName: '12311',
  //     LastName: '1',
  //     Kol: true,
  //     TotalInvitees: 8,
  //     CreateAt: 1655468724,
  //     Archivements: [
  //       {
  //         CoinTypeID: 'cf3784fe-724e-4db2-95f8-ac4b4b894459',
  //         CoinName: 'BTC',
  //         TotalUnits: 43,
  //         TotalAmount: '3320.7173540000003',
  //         CoinUnit: 'TiB',
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false,
  //         CurPercent: 0,
  //         CurGoodID: '19f31fb6-32a8-436d-b52d-5967119554ec'
  //       },
  //       {
  //         CoinTypeID: '32926e24-5507-402f-bfb4-fa242dd72b0d',
  //         CoinName: 'ALEO',
  //         TotalUnits: 6,
  //         TotalAmount: '4798.393195999999',
  //         CoinUnit: 'MSG_ALEO_UNIT',
  //         CoinLogo: 'logo',
  //         SelfUnits: 0,
  //         SelfAmount: '0',
  //         SelfCommission: '1',
  //         TotalCommission: '2',
  //         CurGoodName: 'name',
  //         Editing: false,
  //         CurPercent: 0,
  //         CurGoodID: 'de420061-e878-4a8b-986a-805cadd59233'
  //       }
  //     ]
  //   }
  // ]
  if (good.AppGoods.length === 0) {
    good.getAppGoods({
      Message: {
        Error: {
          Title: t('MSG_GET_APP_GOODS_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
    // NOTHING TODO
    })
  }
})

</script>
