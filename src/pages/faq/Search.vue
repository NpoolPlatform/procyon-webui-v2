<template>
  <ais-instant-search :search-client='searchClient' index-name='faq' id='search-box2'>
    <ais-search-box>
      <template #default='{ currentRefinement, refine }'>
        <input
          type='search'
          :value='currentRefinement'
          @input='refine($event.currentTarget.value)'
        >
        <!-- <span :hidden='!isSearchStalled'>Loading...</span> -->
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
        <p style='color:black'>
          {{ item.name }}
        </p>
        <!-- <ais-highlight
          attribute='name'
          :hit='item'
          highlighted-tag-name='mark'
        /> -->
      </template>
    </ais-hits>
  </ais-instant-search>
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
      )
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
div#search-box2 div.ais-Hits li
  color: black
</style>
