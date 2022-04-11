<template>
  <div class='content'>
    <h2>{{ $t('MSG_KYC_VERIFICATION_STATUS') }}</h2>
    <div class='content-glass kyc-status'>
      <img :src='stateImg'>
      <span class='status'>{{ $t(stateText) }}</span>
      <p class='rejection-note' v-if='state === ReviewState.Rejected'>
        {{ rejectedReason }}
      </p>
    </div>
    <h2>{{ $t('MSG_IDENTIFICATION_DOCUMENTS') }}</h2>
    <div class='content-glass kyc-documents'>
      <div class='document-select'>
        <h4>{{ $t('MSG_DOCUMENT_TYPE') }}</h4>
        <select :name='$t("MSG_DOCUMENT_TYPE")' :disabled='!updatable' v-model='selectedType'>
          <option
            v-for='myType in types'
            :key='myType.value'
            :value='myType'
            :selected='selectedType.value === myType.value'
          >
            {{ myType.label }}
          </option>
        </select>
      </div>
      <div class='kyc-upload'>
        <div class='kyc-image'>
          <img :src='kycIDFront'>
          <span>{{ $t('MSG_UPLOAD') }}</span>
        </div>
        <div v-if='selectedType.value === DocumentType.IDCard' class='kyc-instructions'>
          <h4>{{ $t('MSG_ID_FRONT') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_ID_FRONT_TIP")' />
        </div>
        <div v-else class='kyc-instructions'>
          <h4>{{ $t('MSG_PASSPORT_FRONT') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_PASSPORT_FRONT_TIP")' />
        </div>
      </div>
      <div v-if='selectedType.value === DocumentType.IDCard' class='kyc-upload'>
        <div class='kyc-image'>
          <img :src='kycIDBack'>
          <span>{{ $t('MSG_UPLOAD') }}</span>
        </div>
        <div class='kyc-instructions'>
          <h4>{{ $t('MSG_ID_BACK') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_ID_BACK_TIP")' />
        </div>
      </div>
      <div class='kyc-upload'>
        <div class='kyc-image'>
          <img :src='kycSelfieID'>
          <span>{{ $t('MSG_UPLOAD') }}</span>
        </div>
        <div v-if='selectedType.value === DocumentType.IDCard' class='kyc-instructions'>
          <h4>{{ $t('MSG_SELFIE_ID') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_SELFID_ID_TIP")' />
        </div>
        <div v-else class='kyc-instructions'>
          <h4>{{ $t('MSG_PASSPORT_SELFID') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_PASSPORT_SELFID_TIP")' />
        </div>
      </div>
      <div class='hr' />
      <div class='kyc-submit'>
        <h4>{{ $t('MSG_KYC_CONFIRMATION_TITLE') }}</h4>
        <p v-html='$t("MSG_KYC_CONFIRMATION_CONTENT")' />
        <button>{{ $t('MSG_SUBMIT_DOCUMENTS') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotificationType, useKYCStore, ReviewState, DocumentType } from 'npool-cli-v2'

import kycNotVerified from 'src/assets/kyc-not-verified.svg'
import kycReview from 'src/assets/kyc-review.svg'
import kycRejected from 'src/assets/kyc-rejected.svg'
import kycVerified from 'src/assets/kyc-verified.svg'
import kycIDFront from 'src/assets/kyc-id-front.svg'
import kycIDBack from 'src/assets/kyc-id-back.svg'
import kycSelfieID from 'src/assets/kyc-selfie-id.svg'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const kyc = useKYCStore()
const state = computed(() => kyc.KYC?.State as unknown as ReviewState)
const stateImg = computed(() => {
  switch (state.value) {
    case undefined:
      return kycNotVerified
    case ReviewState.Approved:
      return kycVerified
    case ReviewState.Rejected:
      return kycRejected
    case ReviewState.Wait:
      return kycReview
    default:
      break
  }
  return kycNotVerified
})
const stateText = computed(() => {
  switch (state.value) {
    case undefined:
      return 'MSG_NOT_VERIFIED'
    case ReviewState.Approved:
      return 'MSG_VERIFIED'
    case ReviewState.Rejected:
      return 'MSG_REJECTED'
    case ReviewState.Wait:
      return 'MSG_UNDER_REVIEW'
    default:
      break
  }
  return 'MSG_NOT_VERIFIED'
})
const rejectedReason = computed(() => kyc.KYC?.Message)
const updatable = computed(() => (state.value === ReviewState.Rejected || !state.value))

interface DocTypeItem {
  label: string
  value: DocumentType
}

const types = ref([
  {
    label: 'MSG_ID_CARD',
    value: DocumentType.IDCard
  } as DocTypeItem, {
    label: 'MSG_PASSPORT',
    value: DocumentType.Passport
  } as DocTypeItem
])
const selectedType = ref(types.value[0])

onMounted(() => {
  kyc.getKYC({
    Message: {
      Error: {
        Title: t('MSG_GET_KYC_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    // TODO
  })
})

</script>
