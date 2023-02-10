import { uid } from 'quasar'

interface MenuItem {
  menuId: string;
  label: string;
  caption: string;
  icon: string;
  iconRight?: string;
  target: string;
  level: number;
  sectionBegin?: boolean;
  children: Array<MenuItem>;
}

import dashboard from '../assets/chart-line.svg'
import wallet from '../assets/icon-wallet.svg'
import affiliates from '../assets/icon-affiliates.svg'
import security from '../assets/shield-half.svg'
// import account from '../assets/icon-account.svg'
import kyc from '../assets/user.svg'
import manual from '../assets/manual.svg'
import notification from '../assets/notifications.svg'

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
      label: 'MSG_ALEO_PURCHASE',
      caption: '',
      icon: 'https://procyon-public.s3.ap-northeast-1.amazonaws.com/product-aleo.png',
      target: '/product/aleo',
      level: 0,
      children: []
    },
    {
      menuId: uid(),
      label: 'MSG_DASHBOARD',
      caption: '',
      icon: dashboard,
      target: '/dashboard',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_NOTIFICATIONS',
      caption: '',
      icon: notification,
      target: '/notification',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_REFERRAL',
      caption: '',
      icon: affiliates,
      target: '/affiliates',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_WALLET',
      caption: '',
      icon: wallet,
      target: '/wallet',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_SECURITY',
      caption: '',
      icon: security,
      target: '/security',
      level: 0,
      children: []
    }, /* {
      menuId: uid(),
      label: 'MSG_ACCOUNT',
      caption: '',
      icon: account,
      target: '/account',
      level: 0,
      children: []
    }, */ {
      menuId: uid(),
      label: 'MSG_PERSONAL_INFO',
      caption: '',
      icon: kyc,
      target: '/kyc',
      level: 0,
      children: []
    }, {
      menuId: uid(),
      label: 'MSG_RESOURCES',
      caption: '',
      icon: manual,
      target: '/resource',
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
