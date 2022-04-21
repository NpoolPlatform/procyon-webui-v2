<template>
  <q-btn-dropdown
    class='selector'
    dropdown-icon='expand_more'
    dense
    flat
    no-caps
    auto-close
  >
    <template #label>
      <div class='row country'>
        <div class='column justify-center country'>
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
        :key='myCountry.ID'
        @click='onItemClick(myCountry)'
        :class='[ index % 2 === 0 ? "even" : "odd" ]'
      >
        <div class='row country'>
          <div class='column justify-center country'>
            <q-img fit='contain' class='flag' :src='myCountry.Flag' />
          </div>
          <div class='column justify-center country'>
            {{ myCountry.Country }} ({{ myCountry.Code }})
          </div>
        </div>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang='ts'>
import { computed, onMounted, defineProps, toRef, defineEmits, watch } from 'vue'
import { useLangStore, NotificationType, Country } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'

interface Props {
  country: Country
}

const props = defineProps<Props>()
const country = toRef(props, 'country')

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const lang = useLangStore()
const countries = computed(() => lang.Countries)
watch(countries, () => {
  if (countries.value.length > 0) {
    return
  }

  countries.value.push({
    ID: '1',
    Country: 'China',
    Code: '+86',
    Flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/300px-Flag_of_the_People%27s_Republic_of_China.svg.png',
    Short: 'CN'
  })
  countries.value.push({
    ID: '2',
    Country: 'Singapore',
    Code: '+065',
    Flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/383px-Flag_of_Singapore.svg.png',
    Short: 'SG'
  })

  if (!country.value) {
    emit('update:country', countries.value[0])
  }
})

const emit = defineEmits<{(e: 'update:country', country: Country): void}>()

const onItemClick = (country: Country) => {
  emit('update:country', country)
}

onMounted(() => {
  if (countries.value.length > 0) {
    emit('update:country', countries.value[0])
    return
  }

  lang.getCountries({
    Message: {
      Error: {
        Title: t('MSG_GET_COUNTRIES_CODE'),
        Message: t('MSG_GET_COUNTRIES_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // DO NOTHING
  })
})

</script>

<style lang='sass' scope>
.flag
  height: 16px
  width: 32px
  margin-right: 4px

.country
  color: black
  line-height: 16px

.even
  background-color: #D2D2D2

.odd
  background-color: #E2E2E2

.selector
  color: black

.q-btn--dense
  line-height: 1rem

button
  margin: 0

.selector
  text-shadow: none
</style>
