<template>
  <div class='searchbox-container'>
    <q-layout view='lHh Lpr lFf' container style='height: 450px;' class='shadow-2 rounded-borders'>
      <ais-instant-search :search-client='searchClient' index-name='faq' id='search-box2'>
        <q-page-container>
          <q-page-sticky expand position='top'>
            <ais-search-box style='width: 98%; padding-left: 13px;'>
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
          </q-page-sticky>
          <div style='height: 40px;' />
          <q-page padding style='padding-top: 66px;z-index:-100;padding:0;'>
            <ais-hits style='overflow-y: hidden'>
              <template #item='{ item }'>
                <ais-highlight
                  attribute='name'
                  :hit='item'
                  highlighted-tag-name='mark'
                />
                <div style='height: 20px;' />
              </template>
            </ais-hits>
          </q-page>
          <q-page-sticky expand position='bottom' class='dialog-footer'>
            <ais-panel>
              <div class='row fit'>
                <div class='footer-right' />
                <div class='right-logo'>
                  <ais-powered-by />
                </div>
              </div>
            </ais-panel>
          </q-page-sticky>
        </q-page-container>
      </ais-instant-search>
    </q-layout>
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
  width: 100%
  margin: 0 auto
  margin-top: 14px
  ::v-deep .scroll
    width: calc(100% + 38px) !important
  .searchbox
    border-radius: 4px
    box-shadow: none
    align-items: center
    display: flex
    position: relative
    width: 100%
    border: 2px solid #1ec498
    background: white
    margin: 0
    &:focus
      outline: none
  ::v-deep .ais-Hits-item
    color: black
    &:hover
      background: #1ec498
.dialog-footer
  width: 100%
  background: #ffffff
  box-shadow: 0 -1px 0 0 rgba(35,38,59,.05)
  justify-content: flex-end
  padding-right: 15px
  .right-logo
    margin-top: 20px
</style>
