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
import { useI18n } from 'vue-i18n'
import { useAdminAppCountryStore, AppCountry, NotifyType } from 'npool-cli-v4'

interface Props {
  country: AppCountry
}

const props = defineProps<Props>()
const country = toRef(props, 'country')

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _country = useAdminAppCountryStore()
const countries = computed(() => _country.AppCountries.AppCountries)

const emit = defineEmits<{(e: 'update:country', country: AppCountry): void;}>()

const onItemClick = (country: AppCountry) => {
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
        Title: t('MSG_GET_COUNTRIES_CODE'),
        Message: t('MSG_GET_COUNTRIES_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<AppCountry>) => {
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
