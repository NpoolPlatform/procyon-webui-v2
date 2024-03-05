<template>
  <BackPage>
    <div class='content order-page'>
      <div class='form-container content-glass'>
        <div class='confirmation'>
          <h3>{{ $t('MSG_TWO_FACTOR_AUTH_RECOVERY_CODES') }}</h3>
          <p>
            {{ $t('MSG_TWO_FACTOR_AUTH_RECOVERY_CODES_TIP') }}
          </p>
          <div class='hr' />
          <h4>{{ $t('MSG_RECOVERY_CODES_TITLE') }}:</h4>
          <table class='recovery-codes'>
            <tr v-for='(child,idx) in pairsCode' :key='idx'>
              <td v-for='code in child' :key='code.EntID'>
                {{ code.Code }}
              </td>
            </tr>
          </table>
          <div class='warning'>
            <img src='font-awesome/warning.svg'>
            <span>{{ $t('MSG_BE_SURE_TO_STORE_IN_SAFE_PLACE') }}</span>
          </div>
          <div class='hr' />
          <WaitingBtn
            :disabled='false'
            label='MSG_GENERATE_NEW_RECOVERY_CODES'
            type='submit'
            class='submit-btn'
            :waiting='loading'
            @click='generateNewRecoveryCode'
          />
          <!-- <button @click='onSaveCodeClick'>
            {{ $t('MSG_HAVE_SAVED_MY_CODES') }}
          </button> -->
        </div>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { recoverycode, notify } from 'src/npoolstore'

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))
const WaitingBtn = defineAsyncComponent(() => import('src/components/button/WaitingBtn.vue'))

const recovery = recoverycode.useRecoveryCodeStore()
const codes = computed(() => recovery.RecoveryCodes)

const pairsCode = computed(() => {
  return codes.value?.reduce((result: recoverycode.RecoveryCode[][], value: recoverycode.RecoveryCode, index: number, array: recoverycode.RecoveryCode[]) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, [])
})

const getRecoveryCodes = (offset: number, limit: number) => {
  recovery.getRecoveryCodes({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, codes?: Array<recoverycode.RecoveryCode>) => {
    if (error || codes?.length === 0) {
      return
    }
    getRecoveryCodes(offset + limit, limit)
  })
}

const loading = ref(false)
const generateNewRecoveryCode = () => {
  loading.value = true
  recovery.generateRecoveryCodes({
    Message: {
      Error: {
        Title: 'MSG_GENERATE_RECOVERY_CODES',
        Message: 'MSG_GENERATE_RECOVERY_CODES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

onMounted(() => {
  if (codes.value?.length === 0) {
    getRecoveryCodes(0, 100)
  }
})
</script>

<style lang='sass' scoped>

</style>
