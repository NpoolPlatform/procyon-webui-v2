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
            {{ $t(myType.label) }}
          </option>
        </select>
      </div>
      <div class='kyc-upload'>
        <div class='kyc-image'>
          <DragableImg
            v-model:src='srcFront'
            :placeholder='kycIDFront'
            v-model:selected='frontSelected'
            :updatable='updatable'
          />
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
          <DragableImg
            v-model:src='srcBack'
            :placeholder='kycIDBack'
            v-model:selected='backSelected'
            :updatable='updatable'
          />
          <span>{{ $t('MSG_UPLOAD') }}</span>
        </div>
        <div class='kyc-instructions'>
          <h4>{{ $t('MSG_ID_BACK') }}</h4>
          <p class='kyc-note' v-html='$t("MSG_ID_BACK_TIP")' />
        </div>
      </div>
      <div class='kyc-upload'>
        <div class='kyc-image'>
          <DragableImg
            v-model:src='srcSelfie'
            :placeholder='kycSelfieID'
            v-model:selected='selfieSelected'
            :updatable='updatable'
          />
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
        <p class='kyc-confirmation' v-html='$t("MSG_KYC_CONFIRMATION_CONTENT")' />
        <WaitingBtn
          label='MSG_SUBMIT_DOCUMENTS'
          type='button'
          :disabled='!updatable || submitting'
          :waiting='submitting'
          @click='onSubmit'
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, computed, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { NotificationType, useKYCStore, ReviewState, DocumentType, ImageType, KYCImage, Message } from 'npool-cli-v2'
import { uid } from 'quasar'

import kycNotVerified from 'src/assets/kyc-not-verified.svg'
import kycReview from 'src/assets/kyc-review.svg'
import kycRejected from 'src/assets/kyc-rejected.svg'
import kycVerified from 'src/assets/kyc-verified.svg'
import kycIDFront from 'src/assets/kyc-id-front.svg'
import kycIDBack from 'src/assets/kyc-id-back.svg'
import kycSelfieID from 'src/assets/kyc-selfie-id.svg'

const DragableImg = defineAsyncComponent(() => import('src/components/image/DragableImg.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

const kyc = useKYCStore()

const srcFront = computed({
  get: () => kyc.Images.get(ImageType.Front)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.Front, {
      Type: ImageType.Front,
      URI: '',
      Base64: val
    } as KYCImage)
  }
})
const srcBack = computed({
  get: () => kyc.Images.get(ImageType.Back)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.Back, {
      Type: ImageType.Back,
      URI: '',
      Base64: val
    } as KYCImage)
  }
})
const srcSelfie = computed({
  get: () => kyc.Images.get(ImageType.Handing)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.Handing, {
      Type: ImageType.Handing,
      URI: '',
      Base64: val
    } as KYCImage)
  }
})

const frontSelected = ref(false)
const backSelected = ref(false)
const selfieSelected = ref(false)

const submitting = ref(false)
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

const uploadKyc = () => {
  if (kyc.KYC?.Kyc) {
    kyc.updateKYC({
      Info: {
        ID: kyc.KYC?.Kyc?.ID,
        UserHandingCardImg: kyc.Images.get(ImageType.Handing)?.URI,
        BackCardImg: kyc.Images.get(ImageType.Back)?.URI,
        FrontCardImg: kyc.Images.get(ImageType.Front)?.URI,
        CardType: selectedType.value.value,
        CardID: 'NOT-USED-' + uid()
      },
      Message: {
        Error: {
          Title: t('MSG_UPDATE_KYC_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    })
    submitting.value = false
    return
  }
  kyc.createKYC({
    Info: {
      UserHandingCardImg: kyc.Images.get(ImageType.Handing)?.URI,
      BackCardImg: kyc.Images.get(ImageType.Back)?.URI,
      FrontCardImg: kyc.Images.get(ImageType.Front)?.URI,
      CardType: selectedType.value.value,
      CardID: 'NOT-USED-' + uid()
    },
    Message: {
      Error: {
        Title: t('MSG_CREATE_KYC_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, () => {
    submitting.value = false
  })
}

const onSubmit = () => {
  if (selectedType.value.value === DocumentType.IDCard) {
    if (!backSelected.value && !srcBack.value) {
      return
    }
  }
  if (!frontSelected.value && !srcFront.value) {
    return
  }
  if (!backSelected.value && !srcSelfie.value) {
    return
  }

  submitting.value = true

  kyc.uploadImage({
    ImageType: ImageType.Front,
    ImageBase64: srcFront.value as string,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
        Popup: true,
        Type: NotificationType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      submitting.value = false
      return
    }
    kyc.uploadImage({
      ImageType: ImageType.Handing,
      ImageBase64: srcSelfie.value as string,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, (error: boolean) => {
      if (error) {
        submitting.value = false
        return
      }
      if (selectedType.value.value === DocumentType.Passport) {
        uploadKyc()
        return
      }
      kyc.uploadImage({
        ImageType: ImageType.Back,
        ImageBase64: srcBack.value as string,
        Message: {
          Error: {
            Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, (error: boolean) => {
        if (error) {
          submitting.value = false
          return
        }
        uploadKyc()
      })
    })
  })
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

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
    if (kyc.KYC?.Kyc?.CardType?.length) {
      types.value.forEach((t) => {
        if (t.value === kyc.KYC?.Kyc?.CardType) {
          selectedType.value = t
        }
      })
    }

    kyc.getKYCImage({
      ImageType: ImageType.Front,
      ImageS3Key: kyc.KYC?.Kyc?.FrontCardImg as string,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_FRONT_IMAGE_FAIL'),
          Popup: true,
          Type: NotificationType.Error
        }
      }
    }, () => {
      kyc.getKYCImage({
        ImageType: ImageType.Handing,
        ImageS3Key: kyc.KYC?.Kyc?.UserHandingCardImg as string,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_HANDING_IMAGE_FAIL'),
            Popup: true,
            Type: NotificationType.Error
          }
        }
      }, () => {
        kyc.getKYCImage({
          ImageType: ImageType.Back,
          ImageS3Key: kyc.KYC?.Kyc?.BackCardImg as string,
          Message: {
            Error: undefined as unknown as Message
          }
        }, () => {
          // TODO
        })
      })
    })
  })
})

</script>

<style lang='sass' scoped>
.kyc-confirmation
  background: none
</style>
