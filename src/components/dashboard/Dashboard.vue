<template>
  <div class='content'>
    <MiningSummary />
    <div class='hr' />
    <MiningCards />
    <div class='hr' />
    <Orders />
    <div class='hr' />
  </div>
</template>

<script setup lang='ts'>
import { useProfitStore } from 'src/teststore/mock/profit'
import { useLocalOrderStore } from 'src/teststore/mock/order'
import { defineAsyncComponent, onMounted } from 'vue'
import { NotificationType } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

const MiningSummary = defineAsyncComponent(() => import('src/components/dashboard/MiningSummary.vue'))
const MiningCards = defineAsyncComponent(() => import('src/components/dashboard/MiningCards.vue'))
const Orders = defineAsyncComponent(() => import('src/components/dashboard/Orders.vue'))
const localOrder = useLocalOrderStore()
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const profit = useProfitStore()
const getProfits = (offset: number, limit: number) => {
  profit.getProfits({
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
    // TODO
    if (offset + limit >= profit.Total) {
      return
    }
    getProfits(offset + limit, limit)
  })
}

onMounted(() => {
  getProfits(0, 100)
  localOrder.Orders = [
    {
      ID: '1e936fd0-5e4c-4326-8b77-3ab7420722b8',
      ParentOrderID: '',
      ParentOrderGoodID: '',
      ParentOrderGoodName: '',
      UserID: '5ec833b0-9226-480e-a3c7-2d77632d5ef4',
      EmailAddress: 'string',
      PhoneNO: 'string',
      CoinTypeID: 'cf3784fe-724e-4db2-95f8-ac4b4b894459',
      CoinName: 'Aleo',
      CoinLogo: 'https://procyon-public.s3.ap-northeast-1.amazonaws.com/product-aleo.png',
      CoinUnit: 'ALEO',
      GoodID: 'de420061-e878-4a8b-986a-805cadd59233',
      GoodName: 'ALEO',
      GoodUnit: 'MSG_ALEO_UNIT',
      Units: 1,
      PaymentID: 'string',
      PaymentCoinTypeID: 'string',
      PaymentCoinName: 'string',
      PaymentCoinLogo: 'string',
      PaymentCoinUnit: 'string',
      PaymentCoinUSDCurrency: 'string',
      PaymentLiveUSDCurrency: 'string',
      PaymentLocalUSDCurrency: 'string',
      PaymentAddress: 'string',
      PaymentAmount: '799',
      PayWithBalanceAmount: 'string',
      PayWithParent: true,
      FixAmountID: 'string',
      FixAmountName: 'string',
      FixAmountAmount: 'string',
      DiscountID: 'string',
      DiscountName: 'string',
      DiscountPercent: 0,
      SpecialOfferID: 'string',
      SpecialOfferAmount: 'string',
      CreatedAt: 1659594021,
      PaidAt: 0,
      State: 'DefaultState',
      OrderType: 'DefaultOrderType',
      Start: 1659657600,
      End: 1691193600
    },
    {
      ID: 'd0f043fa-6508-47fe-94f4-dfe094e55ce9',
      ParentOrderID: 'string',
      ParentOrderGoodID: 'string',
      ParentOrderGoodName: 'string',
      UserID: '5ec833b0-9226-480e-a3c7-2d77632d5ef4',
      EmailAddress: 'string',
      PhoneNO: 'string',
      CoinTypeID: '97dbc969-6dbf-4bb3-b245-3319f30ecca2',
      CoinName: 'string',
      CoinLogo: 'string',
      CoinUnit: 'string',
      GoodID: '19f31fb6-32a8-436d-b52d-5967119554ec',
      GoodName: 'bitcoin test',
      GoodUnit: 'TiB',
      Units: 1,
      PaymentID: '25ef5ba8-136e-4650-a6e9-54bd8b78ab29',
      PaymentCoinTypeID: 'string',
      PaymentCoinName: 'string',
      PaymentCoinLogo: 'string',
      PaymentCoinUnit: 'string',
      PaymentCoinUSDCurrency: '1573.09',
      PaymentLiveUSDCurrency: 'string',
      PaymentLocalUSDCurrency: 'string',
      PaymentAddress: 'string',
      PaymentAmount: '0.0064',
      PayWithBalanceAmount: 'string',
      PayWithParent: true,
      FixAmountID: 'string',
      FixAmountName: 'string',
      FixAmountAmount: 'string',
      DiscountID: 'string',
      DiscountName: 'string',
      DiscountPercent: 0,
      SpecialOfferID: 'string',
      SpecialOfferAmount: 'string',
      CreatedAt: 1659445297,
      PaidAt: 0,
      State: 'DefaultState',
      OrderType: 'DefaultOrderType',
      Start: 1659484800,
      End: 1669075200
    },
    {
      ID: '7c8c7a1d-5fcb-43e7-a802-f8f29edfb642',
      ParentOrderID: 'string',
      ParentOrderGoodID: 'string',
      ParentOrderGoodName: 'string',
      UserID: '5ec833b0-9226-480e-a3c7-2d77632d5ef4',
      EmailAddress: 'string',
      PhoneNO: 'string',
      CoinTypeID: '27ba18de-faf2-4d3a-bb90-ee4ddad4fd14',
      CoinName: 'string',
      CoinLogo: 'string',
      CoinUnit: 'string',
      GoodID: '19f31fb6-32a8-436d-b52d-5967119554ec',
      GoodName: 'bitcoin test',
      GoodUnit: 'TiB',
      Units: 1,
      PaymentID: 'd093c61b-82e5-42c6-8396-4b87520dd8db',
      PaymentCoinTypeID: 'string',
      PaymentCoinName: 'string',
      PaymentCoinLogo: 'string',
      PaymentCoinUnit: 'string',
      PaymentCoinUSDCurrency: 'string',
      PaymentLiveUSDCurrency: 'string',
      PaymentLocalUSDCurrency: 'string',
      PaymentAddress: 'string',
      PaymentAmount: '10',
      PayWithBalanceAmount: 'string',
      PayWithParent: true,
      FixAmountID: 'string',
      FixAmountName: 'string',
      FixAmountAmount: 'string',
      DiscountID: 'string',
      DiscountName: 'string',
      DiscountPercent: 0,
      SpecialOfferID: 'string',
      SpecialOfferAmount: 'string',
      CreatedAt: 1659012576,
      PaidAt: 0,
      State: 'DefaultState',
      OrderType: 'DefaultOrderType',
      Start: 1659052800,
      End: 1668643200
    }
  ]
})
</script>

<style lang='sass' scoped>
.order
  max-width: 1040px
</style>
