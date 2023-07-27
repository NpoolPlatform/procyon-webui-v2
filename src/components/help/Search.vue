<template>
  <q-dialog v-model='showing' @update:model-value='onUpdate'>
    <q-card class='popup-card-container'>
      <ais-instant-search
        :search-client='searchClient'
        index-name='faq'
        id='instant-searchbox'
        class='instant-searchbox'
      >
        <q-card-section class='searchbox-top'>
          <ais-search-box
            :placeholder='$t("MSG_SEARCH_HERE")'
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
          <ais-hits
            :class-names='{"ais-Hits": "searchbox-hits", "ais-Hits-list": "", "ais-Hits-item": "searchbox-hits-item"}'
            :transform-items='transformItems'
          >
            <template #item='{ item }'>
              <div class='docsearch-hits-container'>
                <div class='hit-group'>
                  {{ item.group }}
                </div>
                <ul role='listbox' id='docsearch-list'>
                  <li
                    class='docsearch-hit'
                    v-for='child in item.children'
                    :key='child.objectID'
                  >
                    <a :href='getUrl(child)'>
                      <div class='docsearch-hit-container'>
                        <div class='docsearch-hit-content-wrapper'>
                          <template v-if='child.type==="content"'>
                            <span class='docsearch-hit-title' v-html='child._highlightResult["content"]?.value' />
                            <span class='docsearch-hit-path' v-html='child._highlightResult["hierarchy.lvl1"].value' />
                          </template>
                          <span v-if='child.type==="lvl0"' class='docsearch-hit-title' v-html='child._highlightResult["hierarchy.lvl0"]?.value' />
                          <span v-if='child.type==="lvl1"' class='docsearch-hit-title' v-html='child._highlightResult["hierarchy.lvl1"]?.value' />
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </template>
          </ais-hits>
        </q-card-section>
      </ais-instant-search>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' setup>
import 'instantsearch.css/themes/satellite-min.css'
import { AppID, TypesenseApiKey } from 'src/const/const'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { computed, defineProps, toRef, defineEmits, ref } from 'vue'

interface Props {
  visible: boolean;
}
const props = defineProps<Props>()
const visible = toRef(props, 'visible')

const emit = defineEmits<{(e: 'update:visible', visible: boolean): void}>()

const showing = ref(visible)

const onUpdate = () => {
  showing.value = false
  emit('update:visible', false)
}

let baseURL = window.location.protocol + '//api.' + window.location.hostname + '/api'
if (window.location.hostname.startsWith('www.')) {
  baseURL = window.location.origin.replace('www', 'api') + '/api'
}
if (window.location.hostname.includes('.npool.top')) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  baseURL = window.location.protocol + '//api.npool.top' + (window.location.port.length ? ':' + window.location.port : '') + '/api'
}

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TypesenseApiKey,
    nodes: [
      { url: `${baseURL}/typesense` }
    ],
    additionalHeaders: {
      'X-App-Id': AppID
    }
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    query_by: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,content',
    group_by: 'url'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const searchClient = typesenseInstantsearchAdapter.searchClient

interface Hierarchy {
  lvl0: string;
  lvl1: string;
  lvl2: string;
  lvl3: string;
  lvl4: string;
  lvl5: string;
  lvl6: string;
}

interface Highlight {
  value: string; // <mark>highlight text</mark>
}

interface HighlightResult {
  hierarchy: Hierarchy;
  'hierarchy.lvl0': Highlight;
  'hierarchy.lvl1': Highlight;
  content: Highlight;
}

interface Record {
  anchor: string;
  type: string;
  hierarchy: Hierarchy;
  url: string;
  // eslint-disable-next-line camelcase
  url_without_variables: string;
  // eslint-disable-next-line camelcase
  url_without_anchor: string;
  id: string;
  objectID: string;
  _highlightResult: HighlightResult;
  content: string;
}

interface Children extends Record{
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Parent {
  group: string;
  children: Children[];
}

const getUrl = computed(() => (record: Record) => {
  if (record.type === 'lvl0') {
    return record.url_without_anchor
  }
  return record.url_without_variables
})
const transformItems = (items: Record[]) => {
  const parents = [] as Array<Parent>
  items.forEach((el) => {
    if (el.hierarchy.lvl0 !== null && el.hierarchy.lvl1 === null) {
      const parent = parents.find((pl) => pl.group === el.hierarchy.lvl0)
      if (!parent) {
        parents.push({
          group: el.hierarchy.lvl0,
          children: [
            {
              id: el.id,
              objectID: el.objectID,
              anchor: el.anchor,
              type: el.type,
              content: el.hierarchy.lvl0,
              url: el.url,
              url_without_variables: el.url_without_variables,
              url_without_anchor: el.url_without_anchor,
              hierarchy: el.hierarchy,
              _highlightResult: el._highlightResult
            }
          ]
        })
      } else {
        parent.children.push(
          {
            id: el.id,
            objectID: el.objectID,
            anchor: el.anchor,
            type: el.type,
            content: el.hierarchy.lvl0,
            url: el.url,
            url_without_variables: el.url_without_variables,
            url_without_anchor: el.url_without_anchor,
            hierarchy: el.hierarchy,
            _highlightResult: el._highlightResult
          }
        )
      }
    }
  })
  parents.forEach((el) => {
    items.forEach((il) => {
      if (il.hierarchy.lvl0 === el.group && il.hierarchy.lvl1 !== null && il.hierarchy.lvl2 === null) {
        el.children.push({
          id: il.id,
          objectID: il.objectID,
          anchor: il.anchor,
          type: il.type,
          content: '',
          url: il.url,
          url_without_variables: il.url_without_variables,
          url_without_anchor: il.url_without_anchor,
          hierarchy: il.hierarchy,
          _highlightResult: il._highlightResult
        })
      }
    })
  })
  // deal type is content
  const tempArr = [] as Array<Parent>
  items.filter((el) => (el.type === 'content')).forEach((il) => {
    const tempParent = tempArr.find((pl) => pl.group === il.hierarchy.lvl0)
    if (!tempParent) {
      tempArr.push({
        group: il.hierarchy.lvl0,
        children: [
          {
            id: il.id,
            objectID: il.objectID,
            anchor: il.anchor,
            type: il.type,
            content: il.content,
            url: il.url,
            url_without_variables: il.url_without_variables,
            url_without_anchor: il.url_without_anchor,
            hierarchy: il.hierarchy,
            _highlightResult: il._highlightResult
          }
        ]
      })
    } else {
      tempParent.children.push({
        id: il.id,
        objectID: il.objectID,
        anchor: il.anchor,
        type: il.type,
        content: il.content,
        url: il.url,
        url_without_variables: il.url_without_variables,
        url_without_anchor: il.url_without_anchor,
        hierarchy: il.hierarchy,
        _highlightResult: il._highlightResult
      })
    }
  })
  if (parents?.length === 0) {
    return tempArr
  }
  parents.forEach((el) => {
    const temp = tempArr.find((tl) => tl.group === el.group)
    if (temp) {
      el.children.push(...temp.children)
    }
  })
  tempArr.forEach((tl) => {
    const parent = parents.find((el) => el.group === tl.group)
    if (parent) {
      parent.children.push(...tl.children)
    } else {
      parents.push({
        group: tl.group,
        children: tl.children
      })
    }
  })
  return parents
}
</script>
<style lang='sass'>
.popup-card-container
  margin: 60px auto auto
  width: 700px
  max-width: 80vw
  border-radius: 6px !important
  background: linear-gradient(to bottom right, var(--gray-2) 0, var(--dark-violet) 100%)
  border: 1px solid var(--light-green-2-33)
  box-shadow: 16px 16px 20px 0 var(--dark-blue-3)
.searchbox-top
  padding: 12px
.searchbox-form
  height: 46px
  background:  #e1eeef
  border-radius: 12px
  .ais-SearchBox-form::before
    background: no-repeat
    height: 1rem
    left: 1rem
    margin-top: -0.5rem
    position: absolute
    top: 50%
    width: 1rem
.searchbox-input
  margin: 0 !important
  padding-left: 2.5rem !important
  font-size: 1.2rem !important
  &:focus
    outline: none !important
.searchbox-icon-reset
  top: 0%
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
  padding: 0 12px 0 12px
  ::-webkit-overflow-scrolling
    display: none
  .searchbox-hits-item
    color: #e1eeef
    padding: 0
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    box-shadow: none
    border-radius: 8px
    background: none !important
.docsearch-hits-container
  width: 100%
  .hit-group
    font-size: .85em
    font-weight: 600
    line-height: 32px
    margin: 0 -4px
    padding: 0 4px 0
    position: sticky
    top: 0
    z-index: 10
    background-color: transparent
  ul#docsearch-list
    padding-left: 0
    .docsearch-hit
      padding-bottom: 10px
    .docsearch-hit a
      text-decoration: none
      background: linear-gradient(to bottom right, rgba(225, 238, 239, 0.2) 0, rgba(161, 208, 208, 0.1) 100%)
      opacity: .7
      border-radius: 8px
      display: block
      padding-left: 12px
      color: #ffffff
      &:hover
        opacity: 1
      .docsearch-hit-container
        align-items: center
        display: flex
        flex-direction: row
        height: 56px !important
        padding: 0 12px 0 0
        .docsearch-hit-content-wrapper
          display: flex
          flex-direction: column
          font-weight: 500
          justify-content: center
          line-height: 1.2em
          margin: 0 8px
          overflow-x: hidden
          position: relative
          text-overflow: ellipsis
          white-space: nowrap
          width: 100%
          .docsearch-hit-title, .docsearch-hit-path
            mark
              background-color: var(--green-2) !important
          .docsearch-hit-title
            font-size: 0.9rem
</style>
