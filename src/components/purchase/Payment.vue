<template>
  <PurchasePage>
    <div class='info'>
      <h3 class='form-title'>USDT-ERC20 | <strong>Order ID: 123456789</strong></h3>
      <div class='info-flex'>
        <div class='three-section'>
          <h4>Purchase Amount:</h4>
          <span class='number'>3</span>
          <span class='unit'>TB</span>
        </div>
        <div class='three-section'>
          <h4>Amount Due:</h4>
          <span class='number'>1,200</span>
          <span class='unit'>USDT</span>
          <img class='copy-button' src='font-awesome/copy.svg'>
        </div>
        <div class='three-section'>
          <h4>Time Remaining:</h4>
          <span class='number'>06:00:00</span>
        </div>
        <div class='full-section'>
          <h4>Receiving Address:</h4>
          <span class='wallet-type'>ERC20</span>
          <span class='number'>0x0b453543fe40357Dec0452Dc20dEb89C6258Df17</span>
          <img class='copy-button' src='font-awesome/copy.svg'>
        </div>
      </div>
      <div class='hr' />
      <h4>Important Information</h4>
      <ul>
        <li>Make sure to use the correct blockchain (e.g. ERC20 vs TRC20). Using an incorrect blockchain will result in the <strong>permanent loss of your funds</strong>.</li>
        <li>You must send the exact, correct amount of tokens in a <strong>SINGLE PAYMENT</strong>.</li>
        <li>Overpayment or underpayment will not count towards your order. Instead the amount will be added to your wallet balance.</li>
        <li>Depending on network congestion, the transaction can take <strong>up to 1 hour to validate</strong>.</li>
      </ul>
    </div>
    <div class='order-form'>
      <h3 class='form-title'>Scan QR Code to Pay</h3>
      <div class='qr-code-container'>
        <h5>ERC20 ADDRESS</h5>
        <img src='line-qr.png'>
      </div>
      <div class='hr' />
      <button>Payment Complete</button>
      <button class='alt'>Pay Later</button>
    </div>
  </PurchasePage>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const PurchasePage = defineAsyncComponent(() => import('src/components/purchase/PurchasePage.vue'))

</script>
