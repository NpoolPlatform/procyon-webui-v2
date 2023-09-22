<template>
  <UpdatePage
    @submit='onSubmit'
    :label='accountType === appuserbase.SignMethodType.Email ? "MSG_UPDATE_EMAIL" : "MSG_UPDATE_MOBILE"'
    submit-text='MSG_SUBMIT'
    v-model:account='oldAccount'
    v-model:account-type='oldAccountType'
    v-model:verification-code='oldVerificationCode'
    v-model:verification-code-error='oldVerificationCodeError'
  >
    <template #top-right>
      <!-- <div class='switcher'>
        <q-icon
          class='icon'
          size='1.5em'
          :name='accountType === AccountType.Mobile ? "smartphone" : "email"'
        />
      </div> -->
    </template>
    <template #body>
      <PhoneNO
        v-if='accountType === appuserbase.SignMethodType.Mobile'
        v-model:value='phoneNO'
        :error='accountError'
        :required='accountType === appuserbase.SignMethodType.Mobile'
        @focus='onPhoneNOFocusIn'
        @blur='onPhoneNOFocusOut'
      />
      <Input
        v-if='accountType === appuserbase.SignMethodType.Email'
        v-model:value='emailAddress'
        label='MSG_EMAIL_ADDRESS'
        type='email'
        id='email'
        :required='accountType === appuserbase.SignMethodType.Email'
        :error='accountError'
        message='MSG_EMAIL_TIP'
        placeholder='MSG_EMAIL_PLACEHOLDER'
        @focus='onEmailFocusIn'
        @blur='onEmailFocusOut'
      />
      <TimeoutSendBtn :initial-clicked='false' :target-error='accountError' @click='onSendCodeClick' />
      <Input
        v-model:value='myVerificationCode'
        :label='accountType === appuserbase.SignMethodType.Email ? "MSG_EMAIL_VERIFICATION_CODE" : "MSG_MOBILE_VERIFICATION_CODE"'
        type='text'
        id='ver-code'
        required
        :error='verificationCodeError'
        message='MSG_VERIFICATION_CODE_TIP'
        placeholder='MSG_VERIFICATION_CODE_PLACEHOLDER'
        @focus='onVerificationCodeFocusIn'
        @blur='onVerificationCodeFocusOut'
      />
    </template>
  </UpdatePage>
</template>

<script setup lang='ts'>
import { notify, appuserbase, user, utils, basetypes, notifverify } from 'src/npoolstore'
import { defineAsyncComponent, ref, toRef, watch, defineProps } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  accountType: appuserbase.SignMethodType
}

const props = defineProps<Props>()
const accountType = toRef(props, 'accountType')

const UpdatePage = defineAsyncComponent(() => import('src/components/user/UpdatePage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const PhoneNO = defineAsyncComponent(() => import('src/components/input/PhoneNO.vue'))
const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))

const oldAccount = ref('')
const oldAccountType = ref(appuserbase.SignMethodType.Email)
const oldVerificationCode = ref('')
const oldVerificationCodeError = ref(false)

const account = ref('')
const accountError = ref(false)

const phoneNO = ref('')
const onPhoneNOFocusIn = () => {
  accountError.value = false
}
const onPhoneNOFocusOut = () => {
  accountError.value = !utils.validateMobileNO(phoneNO.value)
}
watch(phoneNO, () => {
  if (accountType.value === appuserbase.SignMethodType.Mobile) {
    account.value = phoneNO.value
  }
})

const emailAddress = ref('')
const onEmailFocusIn = () => {
  accountError.value = false
}
const onEmailFocusOut = () => {
  accountError.value = !utils.validateEmailAddress(emailAddress.value)
}
watch(emailAddress, () => {
  if (accountType.value === appuserbase.SignMethodType.Email) {
    account.value = emailAddress.value
  }
})

const myVerificationCode = ref('')
const verificationCodeError = ref(false)
const onVerificationCodeFocusIn = () => {
  verificationCodeError.value = false
}
const onVerificationCodeFocusOut = () => {
  verificationCodeError.value = !utils.validateVerificationCode(myVerificationCode.value)
}

const _notifverify = notifverify.useVerifyStore()
const _user = user.useUserStore()
const router = useRouter()
const logined = user.useLocalUserStore()
const onSubmit = () => {
  if (accountError.value || verificationCodeError.value || oldVerificationCodeError.value) {
    return
  }

  switch (accountType.value) {
    case appuserbase.SignMethodType.Email:
      _user.updateUser({
        Account: oldAccount.value,
        AccountType: oldAccountType.value,
        VerificationCode: oldVerificationCode.value,
        NewAccount: account.value,
        NewAccountType: accountType.value,
        NewVerificationCode: myVerificationCode.value,
        Message: {
          Error: {
            Title: 'MSG_UPDATE_EMAIL',
            Message: 'MSG_UPDATE_EMAIL_FAIL',
            Popup: true,
            Type: notify.NotifyType.Error
          }
        }
      }, (error: boolean, u?: user.User) => {
        if (error) {
          return
        }
        if (u?.LoginAccountType === accountType.value) {
          _user.logout({
            Token: logined.User?.LoginToken,
            Message: {}
          }, () => {
          // TODO
          })
          void router.push({ path: '/signin' })
          return
        }
        void router.push({ path: '/dashboard' })
      })
      break
    case appuserbase.SignMethodType.Mobile:
      _user.updateUser({
        Account: oldAccount.value,
        AccountType: oldAccountType.value,
        VerificationCode: oldVerificationCode.value,
        NewAccount: account.value,
        NewAccountType: accountType.value,
        NewVerificationCode: myVerificationCode.value,
        Message: {
          Error: {
            Title: 'MSG_UPDATE_MOBILE',
            Message: 'MSG_UPDATE_MOBILE_FAIL',
            Popup: true,
            Type: notify.NotifyType.Error
          }
        }
      }, (error: boolean, u?: user.User) => {
        if (error) {
          return
        }
        if (u?.LoginAccountType === accountType.value) {
          _user.logout({
            Token: logined.User?.LoginToken,
            Message: {}
          }, () => {
          // TODO
          })
          void router.push({ path: '/signin' })
          return
        }
        void router.push({ path: '/dashboard' })
      })
      break
  }

  return false
}

const onSendCodeClick = () => {
  accountError.value = !account.value?.length
  if (accountError.value) {
    return
  }
  _notifverify.sendVerificationCode(
    account.value,
    accountType.value as unknown as appuserbase.SigninVerifyType,
    basetypes.EventType.Update,
    account.value)
}

</script>

<style lang='sass' scoped>
.switcher
  width: 0
  height: 0
  border-width: 32px
  border-style: solid
  border-color: #ff964a #ff964a transparent transparent
  border-top-right-radius: 12px

.icon
  margin-right: -48px
  margin-top: -56px
</style>
