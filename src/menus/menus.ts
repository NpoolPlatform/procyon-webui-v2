import { uid } from 'quasar'

interface MenuItem {
  menuId: string
  label: string
  caption: string
  icon: string
  iconRight?: string
  target: string
  level: number
  sectionBegin?: boolean
  children: Array<MenuItem>
}

const FooterTerms = {
  menuId: uid(),
  label: 'MSG_TERMS',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_PRIVACY_POLICY',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_TERMS_OF_USE',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }
  ]
}

const FooterBlog = {
  menuId: uid(),
  label: 'MSG_BLOG',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_ANNOUNCEMENT',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_PRESS',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_NEWS',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_REPORTS',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }
  ]
}

const FooterSupport = {
  menuId: uid(),
  label: 'MSG_SUPPORT',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_FAQS',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_CUSTOMER_SERVICE',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }
  ]
}

const FooterContact = {
  menuId: uid(),
  label: 'MSG_CONTACT',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_COTACT_EMAIL_ADDRESS',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_CONTACT_PHONE_NO',
      caption: '',
      icon: '',
      target: '',
      level: 1,
      children: []
    }
  ]
}

const FooterMenus = [
  FooterTerms,
  FooterBlog,
  FooterSupport,
  FooterContact
]

import computingPower from 'src/assets/ComputingPower.svg'
import order from 'src/assets/Order.svg'
import referral from 'src/assets/Referral.svg'
import withdrawalAddress from 'src/assets/WithdrawalAddress.svg'
import security from 'src/assets/Security.svg'
import identification from 'src/assets/Identification.svg'
import rewardCenter from 'src/assets/RewardCenter.svg'

const HeaderAvatarMenu = {
  menuId: uid(),
  label: 'MSG_PERSONAL_CENTER',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_COMPUTING_POWER',
      caption: '',
      icon: computingPower,
      target: '/user/center',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_ORDER',
      caption: '',
      icon: order,
      target: '/user/center',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_REFERRAL',
      caption: '',
      icon: referral,
      target: '/user/center',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_WITHDRAWAL_ADDRESS',
      caption: '',
      icon: withdrawalAddress,
      target: '/user/center',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_REWARD_CENTER',
      caption: '',
      icon: rewardCenter,
      target: '/user/center',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_SECURITY_CENTER',
      caption: '',
      icon: security,
      target: '/user/center',
      level: 0,
      sectionBegin: true,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_IDENTIFICATION',
      caption: '',
      icon: identification,
      target: '/user/center',
      level: 0,
      children: []
    }
  ]
}

const formatMenuLabel = (item: MenuItem): string => {
  return item.label.replace(/ /g, '')
}

export {
  MenuItem,
  FooterMenus,
  HeaderAvatarMenu,
  formatMenuLabel
}
