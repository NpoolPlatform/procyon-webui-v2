<template>
  <div class='content'>
    <h2>{{ $t('MSG_ACCOUNT') }}</h2>
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
      <input type='submit' :value='$t("MSG_SAVE_CHANGES")' class='account-field'>
    </form>
  </div>
</template>

<script setup lang='ts'>
import {
  useLoginedUserStore, validateUsername
} from 'npool-cli-v2'
import { defineAsyncComponent, ref } from 'vue'
// import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
// const { t } = useI18n({ useScope: 'global' })

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
const gender = ref('')

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

const onSubmit = () => {
  // TODO
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
