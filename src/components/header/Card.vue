<template>
  <ais-instant-search
    :search-client='searchClient'
    :index-name='indexName'
    id='instant-searchbox'
    class='instant-searchbox'
  >
    <q-card-section class='searchbox-top'>
      <ais-search-box
        placeholder='Search here...'
        autofocus
        show-loading-indicator
        reset-title='Remove the query'
        :class-names='{
          "ais-SearchBox-form": "searchbox-form",
          "ais-SearchBox-input": "searchbox-input",
          "ais-SearchBox-submitIcon": "searchbox-submit-icon",
          "ais-SearchBox-reset": "searchbox-icon-reset"
        }'
      />
    </q-card-section>
    <q-card-section class='scroll searchbox-content'>
      <ais-hits :class-names='{"ais-Hits": "searchbox-hits", "ais-Hits-list": "", "ais-Hits-item": "searchbox-hits-item"}'>
        <template #item='{ item }'>
          <ais-highlight
            attribute='Description'
            :hit='item'
            highlighted-tag-name='mark'
            class='ais-highlight'
            @click='handleClick(item)'
          />
        </template>
      </ais-hits>
    </q-card-section>
    <q-card-actions align='right' class='searchbox-footer-container'>
      <div class='searchbox-footer'>
        <div class='left' />
        <div class='right'>
          <ais-powered-by />
        </div>
      </div>
    </q-card-actions>
  </ais-instant-search>
</template>

<script lang='ts' setup>
import algoliasearch from 'algoliasearch/lite'
import 'instantsearch.css/themes/satellite-min.css'
import { useLocaleStore } from 'npool-cli-v4'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface MyData {
  Description: string;
  Url: string;
  ObjectID: string;
}

const searchClient = ref(algoliasearch(
  'GPEKD5F4G0',
  'c0e022782eabbf3af2582e2968827b1e'
))

const locale = useLocaleStore()
const indexName = computed(() => {
  const short = locale.AppLang?.Short
  if (!short.includes('JP') && !short.includes('EN')) {
    return 'jp'
  }
  return short.toLowerCase()
})

const router = useRouter()
const handleClick = (item: MyData) => {
  let path = item.Url?.split('topic=')?.[1]
  if (path.includes('#')) {
    path = path.split('#')?.[0]
  }

  const hash = item.Url.split('#')[1]
  if (item.Url?.length > 0) {
    void router.push({ path: 'faq', query: { topic: path } })
    if (hash?.length > 0) {
      void router.push({ path: 'faq', query: { topic: path }, hash: `#${hash}` })
    }
  }
}

</script>
<style lang='sass'>
.searchbox-top
  padding: 12px 12px 0 12px
.searchbox-form
  height: 56px
  .ais-SearchBox-form::before
    background: no-repeat
    height: 1rem
    left: 1rem
    margin-top: -0.5rem
    position: absolute
    top: 50%
    width: 1rem
.searchbox-input
  border-radius: 6px !important
  background: none !important
  margin: 0 !important
  box-shadow: rgba(119,122,175,.3) 0 1px 4px 0 inset !important
  padding-left: 2.5rem !important
  border: 2px solid #1ec498 !important
  font-size: 1.2rem !important
  &:focus
    outline: none !important
.searchbox-icon-reset
  top: 8%

.searchbox-submit-icon
  width: 24px
  height: 24px
::webkit-scrollbar
  display: none
.searchbox-content::-webkit-scrollbar
  display: none

.searchbox-content
  max-height: 50vh
  overflow-y: scroll
  ::-webkit-overflow-scrolling
    display: none
  .searchbox-hits-item
    padding: 0
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    &:hover
      background: #25c2a0
      cursor: pointer
  .ais-highlight
    color: #444950
    padding: 1rem
    width: 100%
    &:hover
      color: #FFFFFF
.searchbox-footer-container
  align-items: center
  background: #fff
  border-radius: 0 0 8px 8px
  box-shadow: 0 -1px 0 0 #e0e3e8,0 -3px 6px 0 rgba(69,98,155,.12)
  display: flex
  flex-direction: row-reverse
  flex-shrink: 0
  height: 44px
  justify-content: space-between
  padding: 0 12px
  position: relative
  -webkit-user-select: none
  user-select: none
  width: 100%
  z-index: 300
</style>
