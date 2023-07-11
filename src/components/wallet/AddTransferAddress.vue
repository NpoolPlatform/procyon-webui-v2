<template>
  <div :class='[ verifying ? "blur" : "" ]'>
    <FormPage @submit='onSubmit' label='MSG_TRANSFER_REGISTRATION' submit-text='MSG_REGISTER_ADDRESS' :submitting='submitting'>
      <template #form-body>
        <Input
          v-model:value='address'
          label='MSG_PROCYON_ACCOUNT_ID'
          type='text'
          id='address'
          required
          :error='addressError'
          message='MSG_TRANSFER_ADDRESS_TIP'
          placeholder='MSG_PROCYON_ACCOUNT_ID_PLACEHOLDER'
          @focus='onAddressFocusIn'
          @blur='onAddressFocusOut'
        />
        <div class='warning waring-gap'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t("MSG_INTERNAL_TRANSFER_WARNING")' />
        </div>
        <Input
          v-if='false'
          v-model:value='labels'
          label='MSG_TRANSFER_ADDRESS_LABELS'
          type='text'
          id='address'
          :required='false'
          :error='labelsError'
          message=''
          placeholder='MSG_TRANSFER_ADDRESS_LABELS_PLACEHOLDER'
        />
      </template>
      <template #append-submit>
        <h3>{{ $t('MSG_CAUTION') }}</h3>
        <p v-html='$t("MSG_WALLET_ADDRESS_CAUTION_CONTENT")' />
      </template>
    </FormPage>
  </div>
  <q-dialog
    v-model='verifying'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='popup'>
      <CodeVerifier
        v-model:account='account'
        v-model:account-type='accountType'
        @verify='onCodeVerify'
        :used-for='UsedFor.SetTransferTargetUser'
        @cancel='onCancelClick'
        show-cancel
      />
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFrontendTransferAccountStore, AccountType, NotifyType, TransferAccount, validateEmailAddress, validateMobileNO, UsedFor } from 'npool-cli-v4'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const FormPage = defineAsyncComponent(() => import('src/components/page/FormPage.vue'))
const Input = defineAsyncComponent(() => import('src/components/input/Input.vue'))
const CodeVerifier = defineAsyncComponent(() => import('src/components/verifier/CodeVerifier.vue'))

const submitting = ref(false)

const address = ref('')
const submitAddress = computed(() => address.value.replace(/ /g, ''))
const addressError = ref(false)

const onAddressFocusIn = () => {
  addressError.value = false
}
const onAddressFocusOut = () => {
  addressError.value = !address.value.length
}

const labels = ref('')
const labelsError = ref(false)

const verifying = ref(false)

const targetAccountType = ref(AccountType.Email)

const onSubmit = () => {
  if (validateEmailAddress(submitAddress.value)) {
    targetAccountType.value = AccountType.Email
  }
  if (validateMobileNO(submitAddress.value)) {
    targetAccountType.value = AccountType.Mobile
  }
  verifying.value = true
}

const onMenuHide = () => {
  verifying.value = false
}

const account = ref('')
const accountType = ref(AccountType.Email)

const router = useRouter()
const transferAccount = useFrontendTransferAccountStore()

const onCancelClick = () => {
  verifying.value = false
}

const onCodeVerify = (code: string) => {
  console.log('Add Address')
  submitting.value = true
  transferAccount.createTransfer({
    Account: accountType.value === AccountType.Google ? undefined as unknown as string : account.value,
    AccountType: accountType.value,
    VerificationCode: code,
    TargetAccount: submitAddress.value,
    TargetAccountType: targetAccountType.value,
    Message: {
      Error: {
        Title: t('MSG_SET_TRANSFER_ADDRESS'),
        Message: t('MSG_SET_TRANSFER_ADDRESS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (address: TransferAccount, error: boolean) => {
    if (error) {
      submitting.value = false
      onMenuHide()
      return
    }
    void router.back()
    submitting.value = false
  })
}

</script>

<style lang='sass' scoped>
.waring-gap
  margin: 24px 0
</style>
