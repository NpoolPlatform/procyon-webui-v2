<template>
  <Page>
    <template #body>
      <h2>Procyon プラットフォーム：ログイン</h2>
      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>ナビゲーション</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("ログインの方法")'>ログインの方法</a></li>
            <li><a @click='scrollTo("初回ログインの方法")'>初回ログインの方法</a></li>
            <li><a @click='scrollTo("パスワードを忘れた場合")'>パスワードを忘れた場合</a></li>
            <li><a @click='scrollTo("パスワードの変更")'>パスワードの変更</a></li>
            <li><a @click='scrollTo("ログイン履歴の確認方法")'>ログイン履歴の確認方法</a></li>
            <li><a @click='scrollTo("招待コードとはなんですか？")'>招待コードとはなんですか？</a></li>
            <li><a @click='scrollTo("認証コードが届きません")'>認証コードが届きません</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='ログインの方法'>
            ログインの方法
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/CSeoLtAPOR0'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン画面へアクセス後、ご登録メールアドレス／パスワードを入力します。</li>
            <li>(2)その後、画面下部のオレンジ色の『ログイン』ボタンを押下ください。</li>
            <li>(3)ご登録メールアドレスもしくはGoogleAuthenticatorに表示されている認証コードを入力します。</li>
          </ul>

          <h4>認証コード入力画面に進まない場合</h4>
          <p>ログイン時にご入力いただいているメールアドレスもしくはパスワードに誤りがある状態です。</p>
          <p>ご入力内容を見直し、再度ご入力をお願いします。</p>

          <h4>認証コードを入力してもログインができない場合</h4>
          <p>ご入力いただいている認証コードが誤っている状態です。</p>

          <p>メール認証の場合は、届いているメールにて再度ご確認をお願いします。</p>
          <p>GoogleAuthenticatorの場合は、認証コードに制限時間があるため現在表示されているものをご入力ください。</p>

          <p>
            <a
              href='https://drive.google.com/file/d/1aoNOumwbMMoB9KKEwvYMkVpMFBa_wjEt/view?usp=sharing'
              target='_blank'
            >
              ログイン方法のユーザーガイドで確認
            </a>
          </p>

          <h3 id='初回ログインの方法'>
            初回ログインの方法
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/s9bNxlU7JVs'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <p>初回ログインの際は、パスワードの変更後に通常のログイン対応をおこないます。</p>

          <h4>パスワードの変更</h4>
          <ul>
            <li>(1)ログイン画面へアクセスします。</li>
            <li>(2)オレンジ色のログインボタン左下「パスワードを忘れた場合」を押下ください。</li>
            <li>(3)ご注文時に提出したメールアドレスを記入いただき、「コード送信」ボタンを押下します。</li>
            <li>(4)認証コードを受信後、記入欄へ入力します。</li>
            <li>(5)新しいパスワードを入力し、オレンジ色の確認ボタンをクリックします。</li>
          </ul>

          <h4>ログインの対応</h4>
          <ul>
            <li>(1)ログイン画面へアクセス後、ご登録メールアドレス／上記で設定したパスワードを入力します。</li>
            <li>(2)その後、画面下部のオレンジ色の『ログイン』ボタンを押下ください。</li>
            <li>(3)ご登録メールアドレスに届く認証コードを入力します。</li>
          </ul>

          <p>
            <a
              href='https://drive.google.com/file/d/1GahESamBwv7oCtFjizir8Q19F5lRSi6_/view?usp=sharing'
              target='_blank'
            >
              初回ログインの方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='パスワードを忘れた場合'>
            パスワードを忘れた場合
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/s9bNxlU7JVs'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン画面へアクセスします。</li>
            <li>(2)オレンジ色のログインボタン左下「パスワードを忘れた場合」を押下します。</li>
            <li>(3)ご登録メールアドレスを記入いただき、「コード送信」ボタンを押下します。</li>
            <li>(4)認証コードを受信後、記入欄へ入力します。</li>
            <li>(5)新パスワード／新パスワードの再入力をし、オレンジ色の確認ボタンをクリックします。</li>
          </ul>

          <p>
            <a
              href='https://drive.google.com/file/d/1otpSmbJDje3Lt64XrUYt1jSZ0OhlZ4Sk/view?usp=sharing'
              target='_blank'
            >
              パスワードを忘れた場合の対応方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='パスワードの変更'>
            パスワードの変更
          </h3>

          <div class='video-box'>
            <iframe
              width='720' height='405' src='https://www.youtube.com/embed/bMWoc0qflwI'
              title='YouTube video player' frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowfullscreen
            />
          </div>

          <ul>
            <li>(1)ログイン後、セキュリティ画面へアクセスします。</li>
            <li>(2)パスワードの変更という項目の「パスワードを変更」ボタンを押下します。</li>
            <li>(3)1段目の認証コード欄にある「コード送信」ボタンを押下します。</li>
            <li>(4)ご登録アドレスに届いた認証コードを受信後、記入欄へ入力します。</li>
            <li>(5)旧パスワード／新パスワード／新パスワードの再入力をします。</li>
            <li>(6)画面下部のオレンジ色の確認ボタンを押下します。</li>
          </ul>

          <p>
            <a
              href='https://drive.google.com/file/d/1hDYVQStVh-Db5t-ezrRE2idsjgOkdTKk/view?usp=sharing'
              target='_blank'
            >
              パスワードの変更方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='ログイン履歴の確認方法'>
            ログイン履歴の確認方法
          </h3>

          <ul>
            <li>(1)ログイン後、セキュリティページへアクセスします。</li>
            <li>(2)セキュリティページ下部の「ログイン履歴」をご確認ください。</li>
          </ul>

          <p>不明のログインを検知した場合には、<a href='mailto:support@procyon.vip'>support@procyon.vip</a>へご連絡ください。</p>

          <h3 id='招待コードとはなんですか？'>
            招待コードとはなんですか？
          </h3>

          <p>
            招待コードは、特定のユーザーに付与されアカウント登録の際の必須項目です。招待コードをお持ちでない方は、Procyon
            Platformにてアカウント登録を行うことができません。招待コードに関する弊社へのお問い合わせは受け付けておりませんので、あらかじめご了承くださいませ。
          </p>

          <h3 id='認証コードが届きません'>
            認証コードが届きません
          </h3>

          <p>メールの受信設定によっては認証コードのメールが受信ボックスに格納されません。</p>

          <p>以下、対応をお試しください。</p>

          <ul>
            <li>(1)迷惑メールフォルダの確認をする</li>
            <li>(2)以下、件名および送信元アドレスでメールボックス内の検索をおこなう</li>
            <ul>
              <li><strong>件名：</strong>【Procyon】Email認証コード</li>
              <li><strong>送信元メール：</strong>support@procyon.vip</li>
            </ul>
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
