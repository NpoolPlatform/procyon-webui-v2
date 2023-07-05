<template>
  <ais-instant-search :search-client='searchClient' index-name='faq'>
    <ais-search-box />
    <ais-hits>
      <template #item='{ item }'>
        <h4>{{ item.name }}</h4>
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
  }
}
</script>
