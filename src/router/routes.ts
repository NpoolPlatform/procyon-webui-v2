import { RouteRecordRaw } from 'vue-router'
import { RouteMetaImpl } from 'npool-cli-v2/utils'

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaImpl {
    ShowSideMenu?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    name: 'Maintenance',
    path: '/maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    name: 'index',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      },
      {
        name: 'AleoIndex',
        path: 'aleoindex',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'aleo',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Contact',
        path: 'contact',
        component: () => import('pages/Contact.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Registration',
        path: 'registration',
        component: () => import('pages/Registration.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'invitation',
        component: () => import('pages/Registration.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Signin',
        path: 'signin',
        component: () => import('pages/Signin.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Legal',
        path: 'legal',
        component: () => import('pages/Legal.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'FAQ',
        path: 'faq',
        component: () => import('pages/faq/FAQ.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'FAQMenu',
        path: 'faqs',
        component: () => import('pages/faq/FAQMenu.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Partners',
        path: 'partners',
        component: () => import('pages/Partners.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Dashboard',
        path: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Wallet',
        path: 'wallet',
        component: () => import('pages/Wallet.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Notification',
        path: 'notification',
        component: () => import('pages/Notification.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Affiliates',
        path: 'affiliates',
        component: () => import('pages/Affiliates.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'SetupAffiliate',
        path: 'setup/affiliate',
        component: () => import('pages/SetupAffiliate.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'Account',
        path: 'account',
        component: () => import('pages/Account.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Security',
        path: 'security',
        component: () => import('pages/Security.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'KYC',
        path: 'kyc',
        component: () => import('pages/KYC.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Resources',
        path: 'resource',
        component: () => import('pages/Resources.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        name: 'Purchase',
        path: 'purchase',
        component: () => import('pages/Purchase.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'BalancePayment',
        path: 'payment',
        component: () => import('pages/BalancePayment.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'Payment',
        path: 'extrapayment',
        component: () => import('pages/Payment.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'OrderDetail',
        path: 'detail',
        component: () => import('pages/OrderDetail.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'UpdatePassword',
        path: 'update/password',
        component: () => import('pages/UpdatePassword.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'UpdateEmail',
        path: 'update/email',
        component: () => import('pages/UpdateEmail.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'UpdateMobile',
        path: 'update/mobile',
        component: () => import('pages/UpdateMobile.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'EnableGoogle',
        path: 'enable/google',
        component: () => import('pages/EnableGoogle.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'VerifyGoogle',
        path: 'verify/google',
        component: () => import('pages/VerifyGoogle.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'AddAddress',
        path: 'add/address',
        component: () => import('pages/AddAddress.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'AddTransferAddress',
        path: 'add/transferaccount',
        component: () => import('pages/AddTransferAddress.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'Withdraw',
        path: 'withdraw',
        component: () => import('pages/Withdraw.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'remainder/mobile',
        component: () => import('pages/RemainderMobile.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'remainder/affiliate',
        component: () => import('pages/RemainderAffiliate.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'remainder/kyc',
        component: () => import('pages/RemainderKYC.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'remainder/ga',
        component: () => import('pages/RemainderGA.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        name: 'ResetPassword',
        path: 'reset/password',
        component: () => import('pages/ResetPassword.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }, {
        name: 'Aleo',
        path: 'product/aleo',
        component: () => import('pages/product/Aleo.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }, {
        name: 'AleoSilver',
        path: 'product/aleosilver',
        component: () => import('pages/product/AleoSilver.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }, {
        name: 'IronFish2',
        path: 'product/ironfish',
        component: () => import('pages/product/IronFish2.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }, {
        name: 'IronFish',
        path: 'product/old/ironfish',
        component: () => import('pages/product/IronFish.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }, {
        name: 'Spacemesh',
        path: 'product/spacemesh',
        component: () => import('pages/product/Spacemesh.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false,
          ShowSideMenu: false
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
