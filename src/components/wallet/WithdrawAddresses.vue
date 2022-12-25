<template>
  <div :class='[ showing ? "blur" : "" ]'>
    <ShowSwitchTable
      label='MSG_APPROVED_ADDRESSES'
      :rows='(accounts as Array<never>)'
      :table='(table as never)'
      :customize-body='true'
    >
      <template #top-right>
        <div class='buttons'>
          <button @click='onAddNewAddressClick'>
            {{ $t('MSG_ADD_NEW_ADDRESS') }}
          </button>
        </div>
      </template>
      <template #top>
        <div class='warning waring-gap'>
          <img src='font-awesome/warning.svg'>
          <span v-html='$t("MSG_EXTERNAL_TRANSFER_ADDRESS_WARNING")' />
        </div>
      </template>
      <template #table-body='myProps'>
        <q-tr :props='myProps'>
          <q-td key='Blockchain' :props='myProps'>
            <LogoName
              :logo='myProps.row?.CoinLogo'
              :name='accountLabel(myProps.row)'
            />
          </q-td>
          <q-td key='Address' :props='myProps'>
            {{ myProps.row?.Address }}
          </q-td>
          <q-td key='Label' :props='myProps'>
            {{ myProps.row.Labels?.join(',') }}
          </q-td>
          <q-td key='DateAdded' :props='myProps'>
            {{ formatTime(myProps.row?.CreatedAt) }}
          </q-td>
          <q-td key='ActionButtons' :props='myProps'>
            <button class='small' @click='onRemove(myProps.row)'>
              {{ $t('MSG_REMOVE') }}
            </button>
          </q-td>
        </q-tr>
      </template>
    </ShowSwitchTable>
  </div>
  <q-dialog
    v-model='showing'
    seamless
    maximized
    @hide='onMenuHide'
  >
    <div class='product-container content-glass'>
      <div class='popup'>
        <div class='form-container content-glass'>
          <div class='confirmation'>
            <h3>{{ $t('MSG_DELETE_WITHDRAW_ADDRESS') }}</h3>
            <p v-html='$t("MSG_DELETE_WITHDRAW_ADDRESS_CAPTION")' />

            <div class='full-section'>
              <h4>{{ $t('MSG_DELETE_LABEL') }}:</h4>
              <span class='number'>{{ target.Labels?.join(',') }}</span>
            </div>

            <div class='full-section'>
              <h4>{{ $t('MSG_WITHDRAW_ADDRESS') }}:</h4>
              <span class='wallet-type'>{{ target ? accountLabel(target) : '' }}</span><br>
              <span class='number'>{{ target?.Address }}</span>
              <img class='copy-button' src='font-awesome/copy.svg' @click='onCopyAddressClick'>
            </div>

            <button class='alt' @click='onCancelClick'>
              {{ $t('MSG_CANCEL1') }}
            </button>
            <button @click='onDeleteClick'>
              {{ $t('MSG_DELETE_ADDRESS') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, ref } from 'vue'
import { NotificationType, useNotificationStore } from 'npool-cli-v2'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import copy from 'copy-to-clipboard'
import { NotifyType, formatTime, useFrontendUserAccountStore, Account } from 'npool-cli-v4'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const ShowSwitchTable = defineAsyncComponent(() => import('src/components/table/ShowSwitchTable.vue'))
const LogoName = defineAsyncComponent(() => import('src/components/logo/LogoName.vue'))

const account = useFrontendUserAccountStore()
const accounts = computed(() => account.withdrawAddress)

const accountLabel = (acc: Account) => {
  let label = acc.CoinName
  if (acc.CoinDisplayNames.length > 2 && acc.CoinDisplayNames[2].length > 0) {
    label = acc.CoinDisplayNames[2]
  }
  return label
}

const target = ref({} as Account)
const showing = ref(false)

const onRemove = (row: Account) => {
  showing.value = true
  target.value = { ...row }
}

const onCancelClick = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as Account
}

const router = useRouter()
const onAddNewAddressClick = () => {
  void router.push({ path: '/add/address' })
}

const onDeleteClick = () => {
  if (!target.value) {
    return
  }

  account.deleteUserAccount({
    ID: target.value.ID,
    Message: {
      Error: {
        Title: t('MSG_DELETE_WITHDRAW_ACCOUNT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    onMenuHide()
  })
}

const notification = useNotificationStore()
const onCopyAddressClick = () => {
  copy(target.value?.Address)
  notification.Notifications.push({
    Title: t('MSG_ADDRESS_COPIED'),
    Message: t('MSG_COPY_ADDRESS_SUCCESS'),
    Popup: true,
    Type: NotificationType.Success
  })
}

const table = computed(() => [
  {
    name: 'Blockchain',
    label: t('MSG_BLOCKCHAIN'),
    align: 'left',
    field: (row: Account) => row.CoinName
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    align: 'center',
    field: (row: Account) => row.Address
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    align: 'center',
    field: (row: Account) => row.Labels?.join(',')
  },
  {
    name: 'DateAdded',
    label: t('MSG_DATE_ADDED'),
    align: 'center',
    field: (row: Account) => formatTime(row.CreatedAt)
  },
  {
    name: 'ActionButtons',
    label: '',
    align: 'center',
    field: ''
  }
])
</script>

<style lang='sass' scoped>
</style>
