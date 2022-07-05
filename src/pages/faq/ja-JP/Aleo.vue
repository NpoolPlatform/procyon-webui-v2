<template>
  <Page>
    <template #body>
      <h2>Aleo プロジェクト概要</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>ナビゲーション</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Aleo マイニング製品")'>Aleo マイニング製品</a></li>
            <li><a @click='scrollTo("Aleo とは")'>Aleo とは</a></li>
            <li><a @click='scrollTo("Aleoのテクノロジー概要")'>Aleoのテクノロジー概要</a></li>
            <li><a @click='scrollTo("なぜProcyonはAleoを選定したか？")'>なぜProcyonはAleoを選定したか？</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Aleo マイニング製品'>
            Aleo マイニング製品
          </h3>

          <h4>製品詳細</h4>

          <p>
            <strong>マイニング開始時期: </strong>メインネットでローンチ時
            <a href='https://www.aleo.org/post/incentivized-testnet-retrospective' target='_blank'>
              (Aleo公式からのローンチ想定: 2022年第3四半期)
            </a>
          </p>

          <p><strong>マイニング期間: </strong>365日間 (メインネットローンチ後)</p>

          <p><strong>技術サービス料: </strong>20%</p>

          <p>
            <strong>マイニング方法の説明: </strong>
            マイニングマシンのハッシュパワーを最適化するため、1台のマイニングマシンに多数のGPUを統合しています。そのため、Procyonでは、
            1台のマシンが生成するハッシュパワーを100分割いたします。
          </p>

          <h3 id='Aleo とは'>
            Aleo とは
          </h3>

          <h4>Aleo とは</h4>

          <p>Aleo Systems Inc. が開発・運営するWeb3のプライバシー保護に重視したレイヤー１の暗号資産プロジェクトです。</p>

          <h4>Aleo 開発・運営会社情報</h4>

          <ul>
            <li><strong>法人名: </strong>Aleo Systems Inc.</li>
            <li><strong>所在地: </strong>リノ、ネバダ州、アメリカ</li>
            <li><strong>創設日: </strong>2019年</li>
            <li><strong>テストネット1 開始日: </strong>2021年第1四半期</li>
            <li><strong>テストネット２ 開始日: </strong>2021年12月6日</li>
            <li><strong>Mメインネットローンチ日: </strong>2022年 第3四半期 (Aleo公式からの予定)</li>
            <li><a href='https://www.aleo.org/post/aleo-token-economics' target='_blank'>Aleo トークンエコノミー</a></li>
          </ul>

          <h3>4名の創業者</h3>

          <h4>Howard Hu</h4>

          <p>
            UCバークレー校を卒業後、Googleにエンジニアとして入社。その後バークレー校のブロックチェーンアクセラレーターとして務め、
            Dekrypt Capitalでは10年以上ブロックチェーンに携わる。
          </p>

          <h4>Collin Chin</h4>

          <p>
            UCバークレー校在学中にConsenSysでスマートコントラクト開発者としてインターンを経験。Blockchain at
            BerkeleyとArgusでは、テクニカルアドバイザー兼セキュリティコンサルタントを務める。
          </p>

          <h4>Raymond Chu</h4>

          <p>
            UCバークレー校在学中、IBMとAmazonでエンジニアとしてインターンを経験。その後、Blockchain at
            BerkeleyとArgusでプロジェクト・マネージャー兼セキュリティ・コンサルタントを務める。
          </p>

          <h4>Michael Beller</h4>

          <p>アクセンチュアで7年間シニアマネージャーを務める。数々のIT/金融系スタートアップでCOO/CIOを歴任。</p>

          <h3 id='Aleoのテクノロジー概要'>
            Aleoのテクノロジー概要
          </h3>

          <h4>Aleo is the first platform to offer fully private applications.</h4>

          <p>Aleoは、完全なプライベートアプリケーションを提供する史上初のレイヤー1 プラットフォームです。</p>
          <p>分散型システムとゼロ知識暗号技術を活用し、ウェブ上のユーザーデータを保護することで、プライバシーを実現します。</p>
          <p>
            ゼロ知識暗号技術を使用することで、スマートコントラクトの実行をオフチェーンに移行し、完全なプライベート性と毎秒数万件のト
            ランザクションに対応できる多様な分散型アプリケーションを可能にします。オープンなパブリックブロックチェーン上に構築されたAleoは、
            イーサリアムのようにアプリケーションをそのブロックチェーン上で構築できる機能性を持ち、レイヤー1
            であるため構築されたアプリケーションが完全にプライベートになるという非常に革新的なテクノロジーを持ちます。
          </p>

          <h3 id='なぜProcyonはAleoを選定したか？'>
            なぜProcyonはAleoを選定したか？
          </h3>

          <p>
            ベンチャーキャピタルからの投資サポートという点では、FilecoinとAleoの資金調達規模は比較的似ております。
            Filecoinの資金調達総額は258百万米ドル、Aleoの資金調達総額は228百万米ドルとなります。
          </p>

          <p>
            運営・開発チームのバックグラウンドに関しても、Aleoのチームは非常に優秀な人材が揃い、サービスをどのような流れで顧客へ届けるかの包括的な戦略能力を備えています。
          </p>

          <p>技術面では、ゼロ知識証明 (ZKP) により、Web3の将来性に最も重要なインフラの1つを提供します。</p>

          <p>
            Aleoの今後のエコシステムについては、レイヤー1 の技術により、次のEthereumやSolanaになりえる可能性を秘めています。
            すでにゲーム会社のForteと提携したようにAleo上で様々なアプリケーションが開発されることになります。また、
            Web2の世界で問題視されているデータの漏洩、個人データの売買、漏洩したデータを永続的に利用されてしまうことなどの解決策となり得るでしょう。
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
