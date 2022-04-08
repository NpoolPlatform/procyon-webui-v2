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

import dashboard from '../assets/icon-mining.svg'
import wallet from '../assets/icon-wallet.svg'
import affiliates from '../assets/icon-affiliates.svg'
import security from '../assets/icon-security.svg'
import account from '../assets/icon-account.svg'
import kyc from '../assets/icon-kyc.svg'

const BaseMenu = {
  menuId: uid(),
  label: 'MSG_DASHBOARD',
  caption: '',
  icon: '',
  target: '',
  level: 0,
  children: [
    {
      menuId: uid(),
      label: 'MSG_DASHBOARD',
      caption: '',
      icon: 'img:' + dashboard,
      target: '/dashboard',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_WALLET',
      caption: '',
      icon: 'img:' + wallet,
      target: '/wallet',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_REFERRAL',
      caption: '',
      icon: 'img:' + affiliates,
      target: '/affiliates',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_SECURITY',
      caption: '',
      icon: 'img:' + security,
      target: '/security',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_ACCOUNT',
      caption: '',
      icon: 'img:' + account,
      target: '/account',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_KYC',
      caption: '',
      icon: 'img:' + kyc,
      target: '/kyc',
      level: 0,
      children: []
    }
  ]
}

const menuLogout = {
  menuId: uid(),
  label: 'MSG_LOGOUT',
  caption: '',
  icon: 'logout',
  target: '/',
  sectionBegin: true,
  level: 0,
  children: []
} as MenuItem

const HeaderAvatarMenu = (): MenuItem => {
  const menus = [] as Array<MenuItem>
  BaseMenu.children.forEach((menu) => {
    menus.push(menu)
  })
  menus.push(menuLogout)

  const menu = {
    menuId: BaseMenu.menuId,
    label: BaseMenu.label,
    caption: BaseMenu.caption,
    icon: BaseMenu.icon,
    target: BaseMenu.target,
    level: BaseMenu.level,
    children: menus
  } as MenuItem

  return menu
}

const formatMenuLabel = (item: MenuItem): string => {
  return item.label.replace(/ /g, '')
}

export {
  MenuItem,
  HeaderAvatarMenu,
  BaseMenu,
  formatMenuLabel
}
