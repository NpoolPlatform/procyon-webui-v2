<template>
  <Page>
    <template #body>
      <h2>入金・出金・購入</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>目次</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("送金先として外部取引所などのアドレスを登録する方法を教えて下さい")'>送金先として外部取引所などのアドレスを登録する方法を教えて下さい</a></li>
            <li><a @click='scrollTo("送金先としてProcyonアカウントを登録する方法を教えて下さい")'>送金先としてProcyonアカウントを登録する方法を教えて下さい</a></li>
            <li><a @click='scrollTo("マイニング報酬やProcyonウォレットの残高を、外部へ送金する方法を教えて下さい")'>マイニング報酬やProcyonウォレットの残高を、外部へ送金する方法を教えて下さい</a></li>
            <li><a @click='scrollTo("Procyonアカウント間で送金する方法を教えて下さい")'>Procyonアカウント間で送金する方法を教えて下さい</a></li>
            <li><a @click='scrollTo("Procyonウォレットへの入金方法を教えて下さい")'>Procyonウォレットへの入金方法を教えて下さい</a></li>
            <li><a @click='scrollTo("製品の購入方法を教えて下さい")'>製品の購入方法を教えて下さい</a></li>
            <li><a @click='scrollTo("出金の取り消しはできますか？")'>出金の取り消しはできますか？</a></li>
            <li><a @click='scrollTo("なぜ、KYCをしないと出金できないのですか？")'>なぜ、KYCをしないと出金できないのですか？</a></li>
            <li><a @click='scrollTo("誤った暗号資産銘柄／ブロックチェーンにて入金・出金をしてしまいました。")'>誤った暗号資産銘柄／ブロックチェーンにて入金・出金をしてしまいました。</a></li>
            <li><a @click='scrollTo("Procyonウォレットから出金した際の、トランザクションIDの確認方法を教えてください")'>Procyonウォレットから出金した際の、トランザクションIDの確認方法を教えてください</a></li>
            <li><a @click='scrollTo("Procyonウォレットへ入金しましたが指定のウォレットに届きません")'>Procyonウォレットへ入金しましたが指定のウォレットに届きません</a></li>
            <li><a @click='scrollTo("出金しましたが指定のウォレットに届きません")'>出金しましたが指定のウォレットに届きません</a></li>
            <li><a @click='scrollTo("マイニング報酬を日本円に換金はできないのですか？")'>マイニング報酬を日本円に換金はできないのですか？</a></li>
            <li><a @click='scrollTo("マイニング報酬は、どのタイミングで外部ウォレットに出金すればいいんですか？")'>マイニング報酬は、どのタイミングで外部ウォレットに出金すればいいんですか？</a></li>
            <li><a @click='scrollTo("出金して何をすればいいのですか？")'>出金して何をすればいいのですか？</a></li>
            <li><a @click='scrollTo("Procyon.vipのウェブサイトが落ちた際、出金申請中だったのですが出金完了されますか？")'>Procyon.vipのウェブサイトが落ちた際、出金申請中だったのですが出金完了されますか？</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='送金先として外部取引所などのアドレスを登録する方法を教えて下さい'>
            送金先として外部取引所などのアドレスを登録する方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/IGtH51asH88?start=65' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>
          <p>本操作は、『外部への取引』に関する方法です。Procyonアカウント間での取引をされる際には、本FAQ直下をご確認ください。</p>

          <ul>
            <li>(1) ログイン後、ウォレットページへアクセスします</li>
            <li>(2) ウォレットページ下部の「外部送金アドレス」までスクロールください</li>
            <li>(3) 右手にある『新規の送金先アドレスを登録』を押下</li>
            <li>(4) ご希望の送金先の『ブロックチェーンネットワーク』『送金先アドレス』『登録名』をご入力ください</li>
            <li>(5) 下部のオレンジ色のボタンを押下</li>
            <li>(6) 認証コードをご入力ください</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1TYpEcTBoqV38CsCcJ2knw2EImi7dpggJ/view?usp=share_link' target='_blank'>外部送金アドレスの登録方法をユーザーガイドで確認</a></p>

          <h3 id='送金先としてProcyonアカウントを登録する方法を教えて下さい'>
            送金先としてProcyonアカウントを登録する方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/IGtH51asH88?start=227' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <p>本操作は、『Procyonアカウント間の取引』に関する方法です。外部への取引をされる際には、本FAQ直上をご確認ください。</p>

          <ul>
            <li>(1) ログイン後、ウォレットページへアクセスします</li>
            <li>(2) ウォレットページ下部の「PROCYONアカウント間での送金アドレス」までスクロールください</li>
            <li>(3) 右手にある『新規の送金先アドレスを登録』を押下</li>
            <li>(4) 『ProcyonアカウントID』へ送金希望の方のProcyonへ登録しているメールアドレスをご入力ください</li>
            <li>(5) 下部のオレンジ色のボタンを押下</li>
            <li>(6) 認証コードをご入力ください</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1AP69mn8nMWMtJkWgOUTZcOT0UrXp1Vgz/view?usp=share_link' target='_blank'>Procyonアカウント間の送金アドレス登録方法をユーザーガイドで確認</a></p>

          <h3 id='マイニング報酬やProcyonウォレットの残高を、外部へ送金する方法を教えて下さい'>
            マイニング報酬やProcyonウォレットの残高を、外部へ送金する方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/IGtH51asH88' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) ログイン後、ウォレットページへアクセスします</li>
            <li>(2) ウォレットページ上部の「保有資産」をご覧ください</li>
            <li>(3) 暗号資産銘柄の右手にある『送金』ボタンを押下</li>
            <li>(4) 表示がされるポップアップをご確認いただき、問題がなければオレンジ色のボタンを押下</li>
            <li>(5) 遷移した送金画面にて「送金額」「送金先の選択」を入力します</li>
            <li>(5-1) 「送金額」へ希望の金額を入力</li>
            <li>(5-2) 「送金先の選択」にて『外部ウォレットへの送金』を選択</li>
            <li>(5-3) 「送金先アドレスの選択」にて希望のアドレスを選択</li>
            <li>※送金手数料が差し引かれた『取引手数料を差し引いた後の送金額』および『送金先の選択』にまちがいがないかご注意ください</li>
            <li>(6) 画面中段のオレンジ色の『送金』ボタンを押下</li>
            <li>(7) 認証コードをご入力および認証をお願いいたします</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1TYpEcTBoqV38CsCcJ2knw2EImi7dpggJ/view?usp=share_link' target='_blank'>外部ウォレット等への送金方法をユーザーガイドで確認</a></p>

          <h3 id='Procyonアカウント間で送金する方法を教えて下さい'>
            Procyonアカウント間で送金する方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/IGtH51asH88?start=290' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) ログイン後、ウォレットページへアクセスします</li>
            <li>(2) ウォレットページ上部の「保有資産」をご覧ください</li>
            <li>(3) 暗号資産銘柄の右手にある『送金』ボタンを押下</li>
            <li>(4) 表示がされるポップアップをご確認いただき、問題がなければオレンジ色のボタンを押下</li>
            <li>(5) 遷移した送金画面にて「送金額」「送金先の選択」を入力します</li>
            <li>(5-1) 「送金額」へ希望の金額を入力</li>
            <li>(5-2) 「送金先の選択」にて『Procyonアカウント間での送金』を選択</li>
            <li>(5-3) 「送金先アドレスの選択」にて希望のアドレスを選択</li>
            <li>※送金手数料が差し引かれた『取引手数料を差し引いた後の送金額』および『送金先の選択』にまちがいがないかご注意ください</li>
            <li>(6) 画面中段のオレンジ色の『送金』ボタンを押下</li>
            <li>(7) 認証コードをご入力および認証をお願いいたします</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1AP69mn8nMWMtJkWgOUTZcOT0UrXp1Vgz/view?usp=share_link' target='_blank'>Procyonアカウント間での送金方法ユーザーガイドで確認</a></p>

          <h3 id='Procyonウォレットへの入金方法を教えて下さい'>
            Procyonウォレットへの入金方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/LZbpVdEmzzY' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) ログイン後、ウォレットページへアクセスします。</li>
            <li>(2) ウォレットページ上部の「保有資産」をご覧ください</li>
            <li>(3) 暗号資産銘柄の右手にある『入金』ボタンを押下</li>
            <li>(4) 表示がされるポップアップに記載のあるアドレスへお使いの取引所等から送金ください</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1hXt-5S19etkjoyh1EqVSFySLt6ME-Knc/view?usp=share_link' target='_blank'>Procyonウォレットへの入金方法をユーザーガイドで確認</a></p>

          <h4>※誤った暗号資産やブロックチェーンの選択にご注意ください。誤った送金先へ送金をした場合、送金した資産は失われます</h4>

          <h3 id='製品の購入方法を教えて下さい'>
            製品の購入方法を教えて下さい
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/c4uPn8bU-T0' title='YouTube video player'
              frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen
            />
          </div>

          <ul>
            <li>(1) ログイン後、Procyonウォレットへ決済希望の暗号資産をご入金ください</li>
            <li>(2) 入金後、製品購入ページへアクセスください</li>
            <li>(3) 製品購入ページにて、決済希望暗号資産および数量を選択ください</li>
            <li>(4) 選択後、「購入」ボタンを押下</li>
            <li>(5) 遷移先の画面にて注文内容を確認し、問題がなければ「購入」ボタンを押下ください</li>
          </ul>

          <p><a href='https://drive.google.com/file/d/1DuZm_aDiqojpA6VlDq_z4Dt3JTi44XVe/view' target='_blank'>製品の購入方法をユーザーガイドで確認</a></p>

          <h3 id='出金の取り消しはできますか？'>
            出金の取り消しはできますか？
          </h3>

          <p>恐れ入りますが、出金の取り消しはできません。出金時のご入力は細心の注意を払い実施いただけますと幸いでございます。</p>

          <h3 id='なぜ、KYCをしないと出金できないのですか？'>
            なぜ、KYCをしないと出金できないのですか？
          </h3>

          <p>KYCを行うことで不正利用を防止し、そのリスクからお客様をお守りしアカウント保護をしております。また、暗号資産の業界において通例となっています。Procyonのプラットフォームは、セキュリティ体制を強化することで不正利用を未然に防ぎ、お客様へ安全性の高いサービスを提供します。</p>

          <h3 id='誤った暗号資産銘柄／ブロックチェーンにて入金・出金をしてしまいました。'>
            誤った暗号資産銘柄／ブロックチェーンにて入金・出金をしてしまいました。
          </h3>

          <p>恐れ入りますが、誤った入金先や出金先を指定した際の資金は、ブロックチェーンの仕組み上消失いたします。</p>

          <h3 id='Procyonウォレットから出金した際の、トランザクションIDの確認方法を教えてください'>
            Procyonウォレットから出金した際の、トランザクションIDの確認方法を教えてください
          </h3>

          <p>お手数ではございますが、<a href='mailto:support@procyon.vip'>support@procyon.vip</a>まで以下情報とともにご連絡をお願いいたします。</p>

          <h4>▼必要情報</h4>

          <ul>
            <li>暗号資産の銘柄／ブロックチェーン</li>
            <li>送金額</li>
            <li>送金先ウォレットアドレス</li>
          </ul>

          <h3 id='Procyonウォレットへ入金しましたが指定のウォレットに届きません'>
            Procyonウォレットへ入金しましたが指定のウォレットに届きません
          </h3>

          <p>お手数ではございますが、<a href='mailto:support@procyon.vip'>support@procyon.vip</a>まで以下情報とともにご連絡をお願いいたします。</p>

          <h4>▼必要情報</h4>

          <ul>
            <li>暗号資産の銘柄／ブロックチェーン</li>
            <li>送金額</li>
            <li>送金先ウォレットアドレス</li>
          </ul>

          <h3 id='出金しましたが指定のウォレットに届きません'>
            出金しましたが指定のウォレットに届きません
          </h3>

          <p>お手数ではございますが、<a href='mailto:support@procyon.vip'>support@procyon.vip</a>まで以下情報とともにご連絡をお願いいたします。</p>

          <h4>▼必要情報</h4>

          <ul>
            <li>暗号資産の銘柄／ブロックチェーン</li>
            <li>送金額</li>
            <li>送金先ウォレットアドレス</li>
            <li>TXID</li>
          </ul>

          <h3 id='マイニング報酬を日本円に換金はできないのですか？'>
            マイニング報酬を日本円に換金はできないのですか？
          </h3>

          <p>日本円への換金をご希望の際は、一度外部暗号資産取引所に送金してから売却し、日本円に換金していただく必要があります。</p>

          <h3 id='マイニング報酬は、どのタイミングで外部ウォレットに出金すればいいんですか？'>
            マイニング報酬は、どのタイミングで外部ウォレットに出金すればいいんですか？
          </h3>

          <p>出金のタイミングについては、Procyonからアドバイス等の対応はできかねてしまいます。</p>

          <p>Procyonのプラットフォームのダッシュボードにマイニング報酬が着金し対象トークンの出金機能が実装されていましたら、外部ウォレット等へご出金いただけます。</p>

          <h3 id='出金して何をすればいいのですか？'>
            出金して何をすればいいのですか？
          </h3>

          <p>外部ウォレットへ送金して送金先のウォレットに着金が確認されましたら手続きは完了です。その後のお取引に関しましては、お客様ご自身にて決定ください。</p>

          <h3 id='Procyon.vipのウェブサイトが落ちた際、出金申請中だったのですが出金完了されますか？'>
            Procyon.vipのウェブサイトが落ちた際、出金申請中だったのですが出金完了されますか？
          </h3>

          <p>お手数ではございますが、調査実施のため<a href='mailto:support@procyon.vip'>support@procyon.vip</a>まで以下情報とともにご連絡をお願いいたします。</p>

          <h4>▼必要情報</h4>

          <ul>
            <li>暗号資産の銘柄／ブロックチェーン</li>
            <li>送金額</li>
            <li>送金先ウォレットアドレス</li>
          </ul>

          <div class='hr' />
        </div>
      </div>
    </template>
  </Page>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { scrollTo } from 'src/utils/scroll'
const Page = defineAsyncComponent(() => import('src/pages/faq/Page.vue'))

</script>
