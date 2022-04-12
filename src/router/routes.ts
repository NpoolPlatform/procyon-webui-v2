import { RouteRecordRaw } from 'vue-router'
import { RouteMetaImpl } from 'npool-cli-v2/utils'

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaImpl {
    ShowSideMenu?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'contact',
        component: () => import('pages/Contact.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'registration',
        component: () => import('pages/Registration.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'signin',
        component: () => import('pages/Signin.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'legal',
        component: () => import('pages/Legal.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'faq',
        component: () => import('pages/FAQ.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'wallet',
        component: () => import('pages/Wallet.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'affiliates',
        component: () => import('pages/Affiliates.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'account',
        component: () => import('pages/Account.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'security',
        component: () => import('pages/Security.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'kyc',
        component: () => import('pages/KYC.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: true
        }
      }, {
        path: 'purchase',
        component: () => import('pages/Purchase.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'payment',
        component: () => import('pages/Payment.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'update/password',
        component: () => import('pages/UpdatePassword.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'update/email',
        component: () => import('pages/UpdateEmail.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'update/mobile',
        component: () => import('pages/UpdateMobile.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'enable/google',
        component: () => import('pages/EnableGoogle.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'verify/google',
        component: () => import('pages/VerifyGoogle.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'add/address',
        component: () => import('pages/AddAddress.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'withdraw',
        component: () => import('pages/Withdraw.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
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
          ShowMainHeader: false,
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
          ShowMainHeader: false,
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
          ShowMainHeader: false,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: true,
          ShowSideMenu: false
        }
      }, {
        path: 'reset/password',
        component: () => import('pages/ResetPassword.vue'),
        meta: {
          ShowHeaderAnnouncement: true,
          ShowMainHeader: false,
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
