<template>
  <Page>
    <template #body>
      <h2>Spacemesh概要</h2>

      <div class='faq-content'>
        <div class='faq-content-nav'>
          <h3>目次</h3>

          <ul class='faq-nav-links'>
            <li><a @click='scrollTo("Spacemesh マイニング製品")'>Spacemesh マイニング製品</a></li>
            <li><a @click='scrollTo("Spacemeshとは")'>Spacemeshとは</a></li>
            <li><a @click='scrollTo("Spacemeshの技術概要 (DAG構造)")'>Spacemeshの技術概要 (DAG構造)</a></li>
            <li><a @click='scrollTo("なぜProcyonはSpacemeshを選定したか？")'>なぜProcyonはSpacemeshを選定したか？</a></li>
          </ul>

          <div class='hr' />
        </div>

        <div class='faq-content-main'>
          <h3 id='Spacemesh マイニング製品'>
            Spacemesh マイニング製品
          </h3>

          <h4>Product Detail</h4>

          <p><strong>製品詳細：</strong>マイニング開始時期: メインネットでローンチ時 (2022年10月~2022年12月予定)</p>

          <p><strong>マイニング期間：</strong>365日間 (メインネットでローンチ後)</p>

          <p><strong>技術サービス料：</strong>20%</p>

          <p><strong>マイニング方法の説明：</strong>PoST 方式 (余剰ディスクスペース量とその提供時間に基づいて報酬を分配)</p>

          <h3 id='Spacemeshとは'>
            Spacemeshとは
          </h3>

          <h4>Spacemeshとは</h4>

          <p>Unruly Technologies Ltdが開発・運営する暗号資産プロジェクトのひとつです。</p>

          <h4>Spacemesh開発・運営会社情報</h4>

          <ul>
            <li><strong>法人名：</strong>Unruly Technologies LtdM</li>
            <li><strong>所在地：</strong>イスラエル</li>
            <li><strong>創設日：</strong>2018年3月20日</li>
            <li><strong>プロジェクト始動日：</strong>2017年第4四半期</li>
            <li><strong>テストネット開始日：</strong>2019年第3四半期</li>
            <li><strong>メインネットローンチ日：</strong>2022年第3-4四半期予定</li>
            <li><a href='https://spacemesh.io/blog/spacemesh-white-paper-1/' target='_blank'>Spacemeshホワイトペーパー</a></li>
          </ul>

          <h4>2名の創業者</h4>

          <h4>創業者 - Tomer Afek</h4>

          <p>Tomer Afekは、現在SpacemeshのCEO兼共同設立者であり、30年以上にわたりスタートアップ企業への投資に注力してきました。また、大規模なデータ・スタートアップであるConvert Media (taboolaが買収) を共同設立したほか、イスラエルで最も歴史のある、最大のベンチャーキャピタルの1つであるEvergreen Capitalで7年間にわたり投資家として飛躍しました。</p>

          <h4>創業者 - Aviv Eyal</h4>

          <p>Aviv Eyalは、Spacemeshのもう1人の共同設立者であり、メディアやブロックチェーン業界に関連する革新的なスタートアップ企業で複数のCTOを務めてきました。また、サンフランシスコとニューヨークで消費者向けメディアのスタートアップ企業を2社成功させ、ソニーに買収されたCackle.comの共同設立者でもあります。</p>

          <h3 id='Spacemeshの技術概要 (DAG構造)'>
            Spacemeshの技術概要 (DAG構造)
          </h3>

          <p>Spacemesh は、Proof of Space Time（PoST）プロトコルを用いたブロックメッシュ構造をベースとした分散型プラットフォームです。従来のブロックチェーンのようにブロックが一つずつ鎖状に連なるのではなく複数の方向に連なりメッシュ構造を構築します。分散型台帳技術におけるブロックチェーンの抱える課題を解決する代替手段として注目されている DAG(Directed Acyclic Graph)の構造の一つであり、世界で最も分散的で公正な暗号通貨ネットワークです。</p>

          <h3 id='なぜProcyonはSpacemeshを選定したか？'>
            なぜProcyonはSpacemeshを選定したか？
          </h3>

          <p>ベンチャーキャピタルからの投資サポートという点では、よく似た2つのプロジェクトということにも構わず、Spacemeshの方がChiaよりも豪華なベンチャーキャピタルが揃っています。</p>

          <p>運営・開発チームのバックグラウンドに関しても、Spacemeshのチームは非常に優秀な人材が揃い、サービスをどのような流れで顧客へ届けるかの包括的な戦略能力を備えています。</p>

          <p>技術面では、Spacemeshのスマートコントラクト言語は開発者にとってはるかに使いやすく、SpacemeshのブロックチェーンはChiaよりも速くトランザクションを処理することができます。</p>

          <p>Spacemeshの今後のエコシステムについては、SolanaやPolkadotなどの大規模なLayer 2のプロジェクトがSpacemeshにおいて開発されることになります。また、決済方法としては、様々な決済プラットフォームと協力し、エコシステムの成長を後押ししていきます。</p>

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
