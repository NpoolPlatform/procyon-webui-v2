<template>
  <div class='content'>
    <h2>Earnings</h2>
    <div class='earnings-summary'>
      <div class='earnings-figure'>
        <span class='amount'>5,000</span><span class='unit'>USDT</span>
        <div class='hr' />
        <h4 class='description'>Total Earnings</h4>
      </div>
      <div class='earnings-figure'>
        <span class='amount'>250</span><span class='unit'>USDT</span>
        <div class='hr' />
        <h4 class='description'>Yesterday's Earnings</h4>
      </div>
      <div class='earnings-figure'>
        <span class='amount'>5,000</span><span class='unit'>USDT</span>
        <div class='hr' />
        <h4 class='description'>Current Balance</h4>
      </div>
    </div>
    <h2>Mining Dashboard</h2>
    <div class='mining-summary content-glass'>
      <div class='mining-heading'>
        <div class='product-page-icon'>
          <img src='product-spacemesh.svg'>
        </div>
        <h3 class='mining-title'>Spacemesh</h3>
      </div>
      <div class='top-line-summary'>
        <div class='top-line-item'>
          <span class='label'>Earnings:</span>
          <span class='value'>10 SMH</span>
          <span class='sub-value'>(5,000 USDT)</span>
        </div>
        <div class='top-line-item'>
          <span class='label'>Last 24 hours:</span>
          <span class='value'>.5 SMH</span>
          <span class='sub-value'>(250 USDT)</span>
        </div>
        <div class='top-line-item'>
          <span class='label'>Capacity:</span>
          <span class='value'>100 TB</span>
        </div>
      </div>
      <div class='detailed-summary'>
        <div class='line'>
          <span class='label'>Daily Output (30 day avg.):</span>
          <span class='value'>1 SMH</span>
        </div>
        <div class='line'>
          <span class='label'>Technical Service Fee:</span>
          <span class='value'>.2 SMH (20%)</span>
        </div>
        <div class='line'>
          <span class='label'>Net daily output (30 day avg.):</span>
          <span class='value'>.8 SMH</span>
        </div>
        <div class='line'>
          <span class='label'>Total days mining:</span>
          <span class='value'>150 days</span>
        </div>
        <div class='line'>
          <span class='label'>Hashrate (30 day avg.):</span>
          <span class='value'>950 MH/s</span>
        </div>
        <div class='line'>
          <span class='label'>Network Daily Ouput:</span>
          <span class='value'>1,000,000 SMH</span>
        </div>
      </div>
      <div class='buttons'>
        <button class='alt'>Export Daily Output (CSV)</button>
        <button>Purchase Capacity</button>
      </div>
    </div>
    <div class='add-mining'>
      <img src='icon-plus.svg'>
    </div>
  </div>
</template>
