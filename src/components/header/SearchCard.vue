<template>
  <ais-instant-search
    :search-client='searchClient'
    index-name='faq'
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
      <ais-hits
        :class-names='{"ais-Hits": "searchbox-hits", "ais-Hits-list": "", "ais-Hits-item": "searchbox-hits-item"}'
        :transform-items='transformItems'
      >
        <template #item='{ item }'>
          <div class='DocSearch-Hits docsearch-hits-container'>
            <div class='DocSearch-Hit-source'>
              {{ item.group }}
            </div>
            <ul role='listbox' id='docsearch-list'>
              <li
                class='DocSearch-Hit'
                id='docsearch-item-0'
                role='option'
                v-for='child in item.children'
                :key='child.objectID'
                :style='item.children?.length === 1? "padding-bottom:0" : ""'
              >
                <a :href='child.url_without_variables' class='docsearch-a'>
                  <div class='DocSearch-Hit-Container docsearch-hit-container'>
                    <div class='DocSearch-Hit-content-wrapper'>
                      <template v-if='child.type==="content"'>
                        <span class='DocSearch-Hit-title' v-html='child._highlightResult["content"]?.value' />
                        <span class='DocSearch-Hit-path' v-html='child._highlightResult["hierarchy.lvl1"].value' />
                      </template>
                      <span v-if='child.type==="lvl0"' class='DocSearch-Hit-title' v-html='child._highlightResult["hierarchy.lvl0"]?.value' />
                      <span v-if='child.type==="lvl1"' class='DocSearch-Hit-title' v-html='child._highlightResult["hierarchy.lvl1"]?.value' />
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </template>
      </ais-hits>
    </q-card-section>
    <q-card-actions align='right' class='searchbox-footer-container'>
      <div class='searchbox-footer'>
        <div class='left' />
        <div class='right'>
          <!-- <ais-powered-by /> -->
        </div>
      </div>
    </q-card-actions>
  </ais-instant-search>
</template>

<script lang='ts' setup>
import 'instantsearch.css/themes/satellite-min.css'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz', // Be sure to use the search-only-api-key
    nodes: [
      {
        host: '172.16.31.87',
        port: 8108,
        protocol: 'http'
      }
    ]
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    query_by: 'hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,content'
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
.docsearch-hits-container
  width: 100%
  margin-bottom: 0 !important
  ul#docsearch-list
    padding-left: 0
    .docsearch-a
      &:hover
        background: #1035bc
    .docsearch-hit-container
      &:hover
        color: #ffffff
.searchbox-content
  max-height: 50vh
  overflow-y: scroll
  padding: 0 12px 0 12px
  ::-webkit-overflow-scrolling
    display: none
  .searchbox-hits-item
    padding: 0
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    box-shadow: none
    &::hover
        background: #1035bc
    &:hover
      // background: #25c2a0
      // cursor: pointer
  // .ais-highlight
  //   color: #444950
  //   padding: 1rem
  //   width: 100%
  //   &:hover
  //     color: #FFFFFF
// .searchbox-footer-container
//   align-items: center
//   background: #fff
//   border-radius: 0 0 8px 8px
//   box-shadow: 0 -1px 0 0 #e0e3e8,0 -3px 6px 0 rgba(69,98,155,.12)
//   display: flex
//   flex-direction: row-reverse
//   flex-shrink: 0
//   height: 44px
//   justify-content: space-between
//   padding: 0 12px
//   position: relative
//   -webkit-user-select: none
//   user-select: none
//   width: 100%
//   z-index: 300
</style>
