<template>
  <q-btn-dropdown
    class='selector'
    dropdown-icon='expand_more'
    dense
    flat
    no-caps
    auto-close
    menu-anchor='top start'
    menu-self='bottom start'
  >
    <template #label>
      <div class='row country country-label'>
        <div class='column justify-center'>
          <q-img fit='contain' class='flag' :src='country?.Flag' />
        </div>
        <div class='column justify-center'>
          {{ country?.Code }}
        </div>
      </div>
    </template>
    <q-list>
      <q-item
        dense
        clickable
        v-for='(myCountry, index) in countries'
        :key='myCountry?.ID'
        @click='onItemClick(myCountry)'
        :class='[ index % 2 === 0 ? "even" : "odd" ]'
      >
        <div class='row country'>
          <div class='column justify-center country'>
            <q-img fit='contain' class='flag' :src='myCountry?.Flag' />
          </div>
          <div class='column justify-center country'>
            {{ myCountry?.Country }} ({{ myCountry?.Code }})
          </div>
        </div>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang='ts'>
import { computed, onBeforeMount, defineProps, toRef, defineEmits } from 'vue'
import { appcountry, notify } from 'src/npoolstore'

interface Props {
  country: appcountry.Country
}

const props = defineProps<Props>()
const country = toRef(props, 'country')

const _country = appcountry.useAppCountryStore()
const countries = computed(() => _country.countries(undefined))

const emit = defineEmits<{(e: 'update:country', country: appcountry.Country): void;}>()

const onItemClick = (country: appcountry.Country) => {
  emit('update:country', country)
}

onBeforeMount(() => {
  if (countries.value.length > 0) {
    emit('update:country', countries.value[0])
    return
  }

  getAppCountries(0, 100)
})

const getAppCountries = (offset: number, limit: number) => {
  _country.getAppCountries({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES_CODE',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<appcountry.Country>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppCountries(offset + limit, limit)
  })
}
</script>

<style lang='sass' scope>
.flag
  height: 16px
  width: 32px
  margin-right: 4px

.country
  color: black
  line-height: 16px

.country-label
  margin: 10px auto auto auto

.even
  background-color: #D2D2D2

.odd
  background-color: #E2E2E2

.selector
  color: black
  margin: 0
  text-shadow: none

.q-btn--dense
  line-height: 1rem
</style>
