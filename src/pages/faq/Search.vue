<template>
  <div class='searchbox-container'>
    <ais-instant-search :search-client='searchClient' index-name='faq' id='search-box2'>
      <ais-search-box>
        <template #default='{ currentRefinement, refine }'>
          <input
            type='search'
            :value='currentRefinement'
            @input='refine($event.currentTarget.value)'
            placeholder='Search here...'
            autofocus
            :autocomplete='false'
            :autocorrect='false'
            on-submit='searchbox'
            class='searchbox'
          >
        </template>
      </ais-search-box>
      <ais-hits>
        <!-- <template #default='{ items }'>
        <ul>
          <li v-for='item in items' :key='item.objectID'>
            <h1>{{ item.name }}</h1>
            <button
              type='button'
              @click='sendEvent(&apos;click&apos;, item, &apos;Item Added&apos;)'
            >
              Add to cart
            </button>
            <ais-highlight
              attribute='name'
              :hit='item'
              highlighted-tag-name='mark'
            />
          </li>
        </ul>
      </template> -->
        <template #item='{ item }'>
          <ais-highlight
            attribute='name'
            :hit='item'
            highlighted-tag-name='mark'
          />
        </template>
      </ais-hits>
    </ais-instant-search>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
import 'instantsearch.css/themes/satellite-min.css'

export default {
  data () {
    return {
      searchClient: algoliasearch(
        'GPEKD5F4G0',
        'c0e022782eabbf3af2582e2968827b1e'
      ),
      haveInput: false
    }
  },
  methods: {
    onButtonClick () {
      console.log('button')
    }
  }
}
</script>
<style lang='sass' scoped>
.searchbox-container
  width: 95%
  margin: 0 auto
  margin-top: 14px
  .searchbox
    border-radius: 4px
    box-shadow: none
    align-items: center
    display: flex
    position: relative
    width: 100%
    border: 2px solid #1ec498
    background: white
    &:focus
      outline: none
  ::v-deep .ais-Hits-item
    color: black
    &:hover
      background: #1ec498
</style>
