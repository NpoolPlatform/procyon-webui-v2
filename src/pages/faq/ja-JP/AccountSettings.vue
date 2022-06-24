<template>
  <Page>
    <template #body>
      <h2>Procyon プラットフォーム：アカウント情報</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>ナビゲーション</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("アカウント情報の変更 (氏名、住所、ユーザー名)")'>アカウント情報の変更 (氏名、住所、ユーザー名)</a></li>
            <li><a @click='scrollTo("電話番号の設定")'>電話番号の設定</a></li>
            <li><a @click='scrollTo("2段階認証(GoogleAuthenticator)の設定")'>2段階認証(GoogleAuthenticator)の設定</a></li>
            <li><a @click='scrollTo("Google認証のログイン設定")'>Google認証のログイン設定</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='アカウント情報の変更 (氏名、住所、ユーザー名)'>
            アカウント情報の変更 (氏名、住所、ユーザー名)
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/q3FLVYDtlaQ'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン後、アカウントページへアクセスします。</li>
            <li>(2)変更されたい情報の箇所を押下し、入力をします。</li>
            <li>(3)変更箇所の入力後、画面下部の「保存」ボタンを押下します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/1bJDv-K-UTn22XnfhpPyokHRwrqNRVEtA/view?usp=sharing' target='_blank'>
              アカウント情報の変更方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='電話番号の設定'>
            電話番号の設定
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/SFIiq9SdNXA'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン後、セキュリティページへアクセスします。</li>
            <li>(2)携帯電話の認証という項目の「携帯電話を登録」ボタンを押下します。</li>
            <li>(3)表示されたポップアップの1段目に登録されたいご自身の携帯番号を入力します。</li>
            <li>※先頭の「0」をのぞいた番号を入力ください</li>
            <li>(4)2段目の「コード送信」ボタンを押下します。</li>
            <li>(5)1段目に入力した携帯電話にとどいた認証コードを2段目に入力します。</li>
            <li>(6)オレンジ色の「電話の有効化」ボタンを押下します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/17UTgRv4VbXdC-odofNDjkldQPDCQ3J50/view?usp=sharing' target='_blank'>
              電話番号の設定をユーザーガイドで確認
            </a>
          </p>

          <h3 id='2段階認証(GoogleAuthenticator)の設定'>
            2段階認証(GoogleAuthenticator)の設定
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/-ZhLnqi2ESI'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン後、セキュリティページへアクセスします。</li>
            <li>(2)Google認証という項目の「2段階認証の設定」を押下します。</li>
            <li>(3)表示されるポップアップにあるQRコードをGoogleAuthenticatorにて読み込みをします。</li>
            <li>※GoogleAuthenticatorのインストールは以下リンクよりおこなってください</li>
            <ul>
              <li><a href='https://apps.apple.com/jp/app/google-authenticator/id388497605' target='_blank'>iOS(iPhone)用のリンク</a></li>
              <li>
                <a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ja&gl=US' target='_blank'>Android用のリンク</a>
              </li>
            </ul>
            <li>(4)ポップアップ下部にある「次の段階」を押下します。</li>
            <li>(5)GoogleAuthenticatorにて発行されている認証コードを入力します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/1tUF7emxMbfVUkeZkXb-7i_653UNCui-3/view?usp=sharing' target='_blank'>
              2段階認証(GoogleAuthenticator)の設定をユーザーガイドで確認
            </a>
          </p>

          <h3 id='Google認証のログイン設定'>
            Google認証のログイン設定
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/uZnoRTd6L4w'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン後、セキュリティページへアクセスします。</li>
            <li>(2)ログイン認証という項目の「Googleログイン認証」を押下します。</li>
            <li>※「Googleログイン認証」という項目にミドリの丸がついたことをご確認ください。</li>
            <li>(3)「設定」というオレンジ色のボタンを押下します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/1T3gYCMOMsiRGneuqYhUNh4R5GzVGIaJ1/view?usp=sharing' target='_blank'>
              Google認証のログイン設定をユーザーガイドで確認
            </a>
          </p>

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
