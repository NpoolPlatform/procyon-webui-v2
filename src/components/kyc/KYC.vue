<template>
  <div class='content'>
    <Account />
    <div class='hr' />
    <h2>{{ $t('MSG_KYC_VERIFICATION_STATUS') }}</h2>
    <div class='content-glass kyc-status'>
      <img :src='stateImg'>
      <span class='status'>{{ $t(stateText) }}</span>
      <p class='rejection-note' v-if='state === KYCState.Rejected'>
        {{ rejectedReason }}
      </p>
    </div>
    <h2>{{ $t('MSG_IDENTIFICATION_DOCUMENTS') }}</h2>
    <div :class='[ "content-glass kyc-documents", state === KYCState.Approved ? "kyc-verified" : "" ]'>
      <div class='warning'>
        <img :src='warning'>
        <span>{{ $t('MSG_PERSONAL_DETAIL_TIP') }}</span>
      </div>
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
        <h4>
          {{ $t('MSG_KYC_CONFIRMATION_TITLE') }}
        </h4>
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
import { Message } from 'npool-cli-v2'
import { uid } from 'quasar'

import kycNotVerified from 'src/assets/kyc-not-verified.svg'
import kycReview from 'src/assets/kyc-review.svg'
import kycRejected from 'src/assets/kyc-rejected.svg'
import kycVerified from 'src/assets/kyc-verified.svg'
import kycIDFront from 'src/assets/kyc-id-front.svg'
import kycIDBack from 'src/assets/kyc-id-back.svg'
import kycSelfieID from 'src/assets/kyc-selfie-id.svg'
import {
  NotifyType,
  useLocalUserStore,
  useFrontendKYCStore,
  DocumentType,
  ImageType,
  KYCImage,
  EntityType,
  KYCState,
  UpdateKYCRequest
} from 'npool-cli-v4'

import warning from '../../assets/warning.svg'

const DragableImg = defineAsyncComponent(() => import('src/components/image/DragableImg.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))
const Account = defineAsyncComponent(() => import('src/components/account/Account.vue'))

const srcFront = computed({
  get: () => kyc.Images.get(ImageType.FrontImg)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.FrontImg, {
      Type: ImageType.FrontImg,
      URI: '',
      Base64: val
    } as KYCImage)
  }
})
const srcBack = computed({
  get: () => kyc.Images.get(ImageType.BackImg)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.BackImg, {
      Type: ImageType.BackImg,
      URI: '',
      Base64: val
    } as KYCImage)
  }
})
const srcSelfie = computed({
  get: () => kyc.Images.get(ImageType.SelfieImg)?.Base64,
  set: (val) => {
    kyc.Images.set(ImageType.SelfieImg, {
      Type: ImageType.SelfieImg,
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
  label: string;
  value: DocumentType;
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
  if (kyc.KYC) {
    const req = {
      KycID: kyc.KYC?.ID,
      SelfieImg: kyc.Images.get(ImageType.SelfieImg)?.URI as string,
      FrontImg: kyc.Images.get(ImageType.FrontImg)?.URI as string,
      DocumentType: selectedType.value.value,
      IDNumber: 'NOT-USED-' + uid(),
      Message: {
        Error: {
          Title: t('MSG_UPDATE_KYC_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        },
        Info: {
          Title: t('MSG_UPDATE_KYC_SUCCESS'),
          Popup: true,
          Type: NotifyType.Success
        }
      }
    } as UpdateKYCRequest
    if (selectedType.value.value !== DocumentType.Passport) {
      req.BackImg = kyc.Images.get(ImageType.BackImg)?.URI as string
    }
    kyc.updateKYC(req)
    submitting.value = false
    return
  }
  kyc.createKYC({
    SelfieImg: kyc.Images.get(ImageType.SelfieImg)?.URI as string,
    BackImg: kyc.Images.get(ImageType.BackImg)?.URI as string,
    FrontImg: kyc.Images.get(ImageType.FrontImg)?.URI as string,
    DocumentType: selectedType.value.value,
    EntityType: EntityType.Individual,
    IDNumber: 'NOT-USED-' + uid(),
    Message: {
      Error: {
        Title: t('MSG_CREATE_KYC_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_KYC_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
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
    ImageType: ImageType.FrontImg,
    ImageBase64: srcFront.value as string,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      submitting.value = false
      return
    }
    kyc.uploadImage({
      ImageType: ImageType.SelfieImg,
      ImageBase64: srcSelfie.value as string,
      Message: {
        Error: {
          Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
          Popup: true,
          Type: NotifyType.Error
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
        ImageType: ImageType.BackImg,
        ImageBase64: srcBack.value as string,
        Message: {
          Error: {
            Title: t('MSG_UPDATE_KYC_IMAGE_FAIL'),
            Popup: true,
            Type: NotifyType.Error
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

const kyc = useFrontendKYCStore()
const state = computed(() => kyc.KYC?.State as unknown as KYCState)
const stateImg = computed(() => {
  switch (state.value) {
    case undefined:
      return kycNotVerified
    case KYCState.Approved:
      return kycVerified
    case KYCState.Rejected:
      return kycRejected
    case KYCState.Reviewing:
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
    case KYCState.Approved:
      return 'MSG_VERIFIED'
    case KYCState.Rejected:
      return 'MSG_REJECTED'
    case KYCState.Reviewing:
      return 'MSG_UNDER_REVIEW'
    default:
      break
  }
  return 'MSG_NOT_VERIFIED'
})

const logined = useLocalUserStore()

const rejectedReason = computed(() => kyc.KYC?.Message)

const updatable = computed(() => {
  const u = (state.value === KYCState.Rejected || !state.value) &&
        logined.User?.FirstName?.length &&
        logined.User?.LastName?.length &&
        logined.User?.Gender?.length &&
        logined.User?.Username?.length &&
        logined.User?.PostalCode?.length &&
        logined.User?.AddressFields?.length === 5 &&
        logined.User?.AddressFields[0].length &&
        logined.User?.AddressFields[1].length &&
        logined.User?.AddressFields[2].length &&
        logined.User?.AddressFields[3].length
  return u !== undefined ? u as unknown as boolean : false
})

onMounted(() => {
  kyc.getKYC({
    Message: {}
  }, (error: boolean) => {
    if (error) {
      return
    }

    if (kyc.KYC?.DocumentType?.length) {
      types.value.forEach((t) => {
        if (t.value === kyc.KYC?.DocumentType) {
          selectedType.value = t
        }
      })
    }

    kyc.getKYCImage({
      ImageType: ImageType.FrontImg,
      Message: {
        Error: {
          Title: t('MSG_GET_KYC_FRONT_IMAGE_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      kyc.getKYCImage({
        ImageType: ImageType.SelfieImg,
        Message: {
          Error: {
            Title: t('MSG_GET_KYC_HANDING_IMAGE_FAIL'),
            Popup: true,
            Type: NotifyType.Error
          }
        }
      }, () => {
        if (kyc.KYC?.DocumentType === DocumentType.Passport) {
          return
        }

        kyc.getKYCImage({
          ImageType: ImageType.BackImg,
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

.form-container
  max-width: 100%
  min-width: 80%
  margin: 0
  padding: 48px
  max-height: 80%
  overflow: scroll
</style>
