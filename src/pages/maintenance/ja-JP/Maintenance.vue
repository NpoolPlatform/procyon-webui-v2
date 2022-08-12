<template>
  <slot name='top-right' />
  <div class='maintenance'>
    <div>
      <img :src='lightLogo'>
      <h2>日頃より本サイトをご利用いただき、誠にありがとうございます。</h2>
      <p>ただいまシステムの更新のためサービスを休止しております。作業終了まで、今しばらくお待ちいただきたく存じます。ご不便をお掛け致しますが、ご理解いただきますようお願い申し上げます。</p>
    </div>
  </div>
</template>
<script setup lang='ts'>
import lightLogo from 'src/assets/procyon-light.svg'
</script>
