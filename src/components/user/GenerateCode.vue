<template>
  <BackPage>
    <div class='content order-page'>
      <div class='form-container content-glass'>
        <div class='confirmation'>
          <h3>{{ $t('MSG_TWO_FACTOR_AUTH_RECOVERY_CODES') }}</h3>
          <p v-html='$t("MSG_TWO_FACTOR_AUTH_RECOVERY_CODES_TIP")' />
          <div class='hr' />
          <h4>{{ $t('MSG_RECOVERY_CODES_TITLE') }}</h4>
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
          <button @click='onSaveCodeClick'>
            {{ $t('MSG_HAVE_SAVED_MY_CODES') }}
          </button>
        </div>
      </div>
    </div>
  </BackPage>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { recoverycode } from 'src/npoolstore'
import { useRouter } from 'vue-router'

const BackPage = defineAsyncComponent(() => import('src/components/page/BackPage.vue'))

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

onMounted(() => {
  if (codes.value?.length === 0) {
    getRecoveryCodes(0, 100)
  }
})

const router = useRouter()

const onSaveCodeClick = () => {
  void router.push({ path: '/security' })
}

</script>

<style lang='sass' scoped>

</style>
