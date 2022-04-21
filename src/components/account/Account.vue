<template>
  <div class='content'>
    <h2>{{ $t('MSG_ACCOUNT_TITLE') }}</h2>
    <form class='content-glass alignment' action='javascript:void(0)' @submit='onSubmit'>
      <h3>{{ $t('MSG_PERSON_DETAILS_FOR_KYC') }}</h3>
      <div class='row'>
        <div class='account-field'>
          <Input
            v-model:value='username'
            label='MSG_USERNAME'
            type='text'
            id='username'
            required
            :error='usernameError'
            message='MSG_USERNAME_TIP'
            placeholder='MSG_USERNAME_PLACEHOLDER'
            @focus='onUsernameFocusIn'
            @blur='onUsernameFocusOut'
          />
        </div>
        <q-space />
        <div class='account-field'>
          <label for='gender'>{{ $t('MSG_GENDER') }}</label>
          <select id='gender' :name='$t("MSG_GENDER")' v-model='gender' required>
            <option
              v-for='myGender in genders'
              :key='myGender'
              :value='myGender'
              :selected='myGender === gender'
            >
              {{ $t(myGender) }}
            </option>
          </select>
        </div>
      </div>
      <div class='row'>
        <div class='account-field'>
          <Input
            v-model:value='firstName'
            label='MSG_FIRST_NAME'
            type='text'
            id='first-name'
            required
            :error='firstNameError'
            message='MSG_FIRST_NAME_TIP'
            placeholder='MSG_FIRST_NAME_PLACEHOLDER'
            @focus='onFirstNameFocusIn'
            @blur='onFirstNameFocusOut'
          />
        </div>
        <q-space />
        <div class='account-field'>
          <Input
            v-model:value='lastName'
            label='MSG_LAST_NAME'
            type='text'
            id='last-name'
            required
            :error='lastNameError'
            message='MSG_LAST_NAME_TIP'
            placeholder='MSG_LAST_NAME_PLACEHOLDER'
            @focus='onLastNameFocusIn'
            @blur='onLastNameFocusOut'
          />
        </div>
      </div>
      <h3>{{ $t('MSG_ADDRESS') }}</h3>
      <div class='row'>
        <div class='account-field'>
          <Input
            v-model:value='postalCode'
            label='MSG_POSTAL_CODE'
            type='text'
            id='postal-code'
            :required='false'
            :error='postalCodeError'
            message='MSG_POSTAL_CODE_TIP'
            placeholder='MSG_POSTAL_CODE_PLACEHOLDER'
          />
        </div>
        <q-space />
        <div class='account-field'>
          <Input
            v-model:value='province'
            label='MSG_PROVINCE'
            type='text'
            id='province'
            :required='false'
            :error='provinceError'
            message='MSG_PROVINCE_TIP'
            placeholder='MSG_PROVINCE_PLACEHOLDER'
          />
        </div>
      </div>
      <div class='row'>
        <div class='account-field'>
          <Input
            v-model:value='street1'
            label='MSG_STREET1'
            type='text'
            id='street1'
            :required='false'
            :error='street1Error'
            message='MSG_STREET1_TIP'
            placeholder='MSG_STREE1_PLACEHOLDER'
          />
        </div>
        <q-space />
        <div class='account-field'>
          <Input
            v-model:value='street2'
            label='MSG_STREET2'
            type='text'
            id='street2'
            :required='false'
            :error='street2Error'
            message='MSG_STREET2_TIP'
            placeholder='MSG_STREET2_PLACEHOLDER'
          />
        </div>
      </div>
      <div class='row'>
        <div class='account-field'>
          <Input
            v-model:value='city'
            label='MSG_CITY'
            type='text'
            id='city'
            :required='false'
            :error='cityError'
            message='MSG_CITY'
            placeholder='MSG_CITY_PLACEHOLDER'
          />
        </div>
        <q-space />
        <div class='account-field'>
          <Input
            v-model:value='country'
            label='MSG_COUNTRY'
            type='text'
            id='country'
            :required='false'
            :error='countryError'
            message='MSG_COUNTRY_TIP'
            placeholder='MSG_COUNTRY_PLACEHOLDER'
          />
        </div>
      </div>
      <input type='submit' :value='$t("MSG_SAVE_CHANGES")' class='account-field' @click='onSubmit'>
    </form>
  </div>
</template>

<script setup lang='ts'>
import {
  NotificationType,
  useLoginedUserStore,
  useUserStore,
  validateUsername
} from 'npool-cli-v2'
import { uid } from 'quasar'
import { defineAsyncComponent, ref, computed } from 'vue'

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))

const logined = useLoginedUserStore()

const username = ref(logined.LoginedUser?.Extra?.Username as string)
const usernameError = ref(false)
const onUsernameFocusIn = () => {
  usernameError.value = false
}
const onUsernameFocusOut = () => {
  usernameError.value = !username.value || !validateUsername(username.value)
}

const genders = ref(['MSG_FAMALE', 'MSG_MALE', 'MSG_OTHER'])
const gender = ref(logined.LoginedUser?.Extra?.Gender)

const firstName = ref(logined.LoginedUser?.Extra?.FirstName as string)
const firstNameError = ref(false)
const onFirstNameFocusIn = () => {
  firstNameError.value = false
}
const onFirstNameFocusOut = () => {
  firstNameError.value = firstName.value.length === 0
}

const lastName = ref(logined.LoginedUser?.Extra?.LastName as string)
const lastNameError = ref(false)
const onLastNameFocusIn = () => {
  lastNameError.value = false
}
const onLastNameFocusOut = () => {
  lastNameError.value = lastName.value.length === 0
}

const postalCode = ref(logined.LoginedUser?.Extra?.PostalCode as string)
const postalCodeError = ref(false)

const addressFields = ref(logined.LoginedUser?.Extra?.AddressFields ? logined.LoginedUser?.Extra?.AddressFields : [])
const country = computed({
  get: () => addressFields.value.length > 0 ? addressFields.value[0] : '',
  set: (val) => {
    addressFields.value = [val, province.value, city.value, street1.value, street2.value]
  }
})
const countryError = ref(false)

const province = computed({
  get: () => addressFields.value.length > 1 ? addressFields.value[1] : '',
  set: (val) => {
    addressFields.value = [country.value, val, city.value, street1.value, street2.value]
  }
})

const provinceError = ref(false)

const city = computed({
  get: () => addressFields.value.length > 2 ? addressFields.value[2] : '',
  set: (val) => {
    addressFields.value = [country.value, province.value, val, street1.value, street2.value]
  }
})

const cityError = ref(false)

const street1 = computed({
  get: () => addressFields.value.length > 3 ? addressFields.value[3] : '',
  set: (val) => {
    addressFields.value = [country.value, province.value, city.value, val, street2.value]
  }
})

const street1Error = ref(false)

const street2 = computed({
  get: () => addressFields.value.length > 4 ? addressFields.value[4] : '',
  set: (val) => {
    addressFields.value = [country.value, province.value, city.value, street1.value, val]
  }
})

const street2Error = ref(false)

const user = useUserStore()

const onSubmit = () => {
  usernameError.value = !username.value.length
  firstNameError.value = !firstName.value.length
  lastNameError.value = !lastName.value.length

  if (usernameError.value || firstNameError.value || lastNameError.value) {
    return
  }

  if (!logined.LoginedUser?.Extra) {
    user.createExtra({
      Info: {
        IDNumber: 'NOT-USED' + uid(),
        Username: username.value,
        AddressFields: addressFields.value,
        Gender: gender.value,
        PostalCode: postalCode.value,
        FirstName: firstName.value,
        LastName: lastName.value
      },
      Message: {
        Error: {
          Title: t('MSG_CREATE_EXTRA'),
          Message: t('MSG_CREATE_EXTRA_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
    // TODO
    })
    return false
  }

  logined.LoginedUser.Extra.AddressFields = addressFields.value
  logined.LoginedUser.Extra.Username = username.value
  logined.LoginedUser.Extra.Gender = gender.value
  logined.LoginedUser.Extra.PostalCode = postalCode.value
  logined.LoginedUser.Extra.FirstName = firstName.value
  logined.LoginedUser.Extra.LastName = lastName.value

  user.updateExtra({
    Info: logined.LoginedUser.Extra,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_EXTRA'),
        Message: t('MSG_UPDATE_EXTRA_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })

  return false
}

</script>

<stype lang='sass' scoped>
.account-field
  width: 49% !important
  @media (max-width: $breakpoint-sm-max)
    width: 100%  !important

.alignment
  margin-left: 0px !important
  margin-right: 0px !important
</stype>
