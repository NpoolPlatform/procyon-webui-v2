<template>
  <Page>
    <template #body>
      <h2>Procyon プラットフォーム：ダッシュボード</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>ナビゲーション</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("マイニング報酬の確認方法")'>マイニング報酬の確認方法</a></li>
            <li><a @click='scrollTo("SMHとはなんですか？")'>SMHとはなんですか？</a></li>
            <li><a @click='scrollTo("SMHの報酬量が日々ちがうのはなぜですか？")'>SMHの報酬量が日々ちがうのはなぜですか？</a></li>
            <li><a @click='scrollTo("注文履歴の確認方法")'>注文履歴の確認方法</a></li>
            <li><a @click='scrollTo("マイニング量のデータの書き出し方法（CSVデータ）")'>マイニング量のデータの書き出し方法（CSVデータ）</a></li>
            <li><a @click='scrollTo("ダッシュボードの数値に変化がないのはなぜですか？")'>ダッシュボードの数値に変化がないのはなぜですか？</a></li>
            <li><a @click='scrollTo("技術サービス料とは？")'>技術サービス料とは？</a></li>
            <li><a @click='scrollTo("ハッシュレートとは？")'>ハッシュレートとは？</a></li>
            <li><a @click='scrollTo("ネットワークのマイニング量とは？")'>ネットワークのマイニング量とは？</a></li>
            <li>
              <a @click='scrollTo("Procyonプラットフォームのサーバーが落ちた場合は、マイニングも止まるのですか？")'>
                Procyonプラットフォームのサーバーが落ちた場合は、マイニングも止まるのですか？
              </a>
            </li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='マイニング報酬の確認方法'>
            マイニング報酬の確認方法
          </h3>

          <ul>
            <li>(1)ログイン後、ダッシュボードページへアクセスします。</li>
            <li>(2)画面上部の「マイニング報酬」「マイニングダッシュボード」より確認します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/1UwNYdUL3tVyQq8xeDocx3yO12K7khzLB/view?usp=sharing' target='_blank'>
              マイニング報酬の確認方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='SMHとはなんですか？'>
            SMHとはなんですか？
          </h3>

          <p>SMHとは、Spacemeshのトークンです。</p>
          <p>SMHのマイニング製品をご購入された場合、マイニング期間中日々マイニングされ、Procyonのプラットフォームへ着金いたします。</p>

          <h3 id='SMHの報酬量が日々ちがうのはなぜですか？'>
            SMHの報酬量が日々ちがうのはなぜですか？
          </h3>

          <p>マイニングのパフォーマンスによって、その日のマイニング量がことなるためです。</p>
          <p>パフォーマンスの差異は、その日のマイニング参加者数等の市場からの影響で発生します。</p>

          <h3 id='注文履歴の確認方法'>
            注文履歴の確認方法
          </h3>

          <ul>
            <li>(1)ログイン後、ダッシュボードページへアクセスします。</li>
            <li>(2)画面下部の「注文履歴」より確認します。</li>
          </ul>

          <p>
            <a href='https://drive.google.com/file/d/1ALtS3UrHNSB-hp7LBxXSiyCztqNCWUsD/view?usp=sharing' target='_blank'>
              注文履歴の確認方法をユーザーガイドで確認
            </a>
          </p>

          <h3 id='マイニング量のデータの書き出し方法（CSVデータ）'>
            マイニング量のデータの書き出し方法（CSVデータ）
          </h3>

          <ul>
            <li>(1)ログイン後、ダッシュボードページへアクセスします。</li>
            <li>(2)画面下部の「マイニングダッシュボード」もしくは「注文履歴」の左下にある、「マイニング量のデータを書き出す（CSVデータ）」というボタンを押下します。</li>
          </ul>

          <h3 id='ダッシュボードの数値に変化がないのはなぜですか？'>
            ダッシュボードの数値に変化がないのはなぜですか？
          </h3>

          <p>2022年5月現在、Spacemeshのマイニングが開始されておらず、マイニング報酬が発生していないためです。</p>

          <p>Spacemeshの進捗状況等につきましては、新着情報があり次第お客様皆さまへご報告させていただきます。</p>

          <h3 id='技術サービス料とは？'>
            技術サービス料とは？
          </h3>

          <p>技術サービス料は、お客様のマイニングマシンの保守・運用コストのことです。</p>
          <p>お客様の日々のマイニング報酬から自動的に差し引かれます。</p>

          <h3 id='ハッシュレートとは？'>
            ハッシュレートとは？
          </h3>

          <p>マイニングをする際の速さを表した数値です。</p>
          <p>「MH/s」は1秒間に何回計算がされるかを示し、この数値が高ければ高いほどマイニングの効率に影響をあたえるひとつの指標です。</p>

          <h3 id='ネットワークのマイニング量とは？'>
            ネットワークのマイニング量とは？
          </h3>

          <p>Spacemeshのネットワーク上全体でのマイニング量を示します。</p>
          <p>こちらは、Spacemesh社が提示している数値です。</p>

          <h3 id='Procyonプラットフォームのサーバーが落ちた場合は、マイニングも止まるのですか？'>
            Procyonプラットフォームのサーバーが落ちた場合は、マイニングも止まるのですか？
          </h3>

          <p>いえ、Procyonのプラットフォームが稼働していない場合もマイニングは止まっておりません。</p>
          <p>マイニングを行っているのは以下、香港のデータセンターのためです。それぞれが独立して稼働しているためマイニングは問題なく行われております。</p>
          <p><strong>データセンター所在地：</strong>18 Chun Yat Street, Tseung Kwan O Industrial Estate, New Territories, Hong Kong</p>

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
