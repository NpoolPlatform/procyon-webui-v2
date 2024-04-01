import { RouteRecordRaw } from 'vue-router'
import { RouteMetaImpl } from 'src/npoolstore/utils/intercepter'

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaImpl {
    ShowSideMenu?: boolean
    Title?: string
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
    path: '/:lang?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          Title: 'Index',
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
          Title: 'AleoIndex',
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
        name: 'AleoIndexFallback',
        path: '#/aleoindex',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          Title: 'AleoIndex',
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
          Title: 'AleoIndex',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        path: '#/aleo',
        component: () => import('pages/AleoIndex.vue'),
        meta: {
          Title: 'AleoIndex',
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
          Title: 'Contact',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'ContactFallback',
        path: '#/contact',
        component: () => import('pages/Contact.vue'),
        meta: {
          Title: 'Contact',
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
          Title: 'Registration',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'RegistrationFallback',
        path: '#/registration',
        component: () => import('pages/Registration.vue'),
        meta: {
          Title: 'Registration',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Invitation',
        path: 'invitation',
        component: () => import('pages/Registration.vue'),
        meta: {
          Title: 'Invitation',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'InvitationFallback',
        path: '#/invitation',
        component: () => import('pages/Registration.vue'),
        meta: {
          Title: 'Invitation',
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
          Title: 'Signin',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'SigninFallback',
        path: '#/signin',
        component: () => import('pages/Signin.vue'),
        meta: {
          Title: 'Signin',
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
          Title: 'Legal',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'LegalFallback',
        path: '#/legal',
        component: () => import('pages/Legal.vue'),
        meta: {
          Title: 'Legal',
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
          Title: 'FAQ',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'Company',
        path: 'company',
        component: () => import('pages/Company.vue'),
        meta: {
          Title: 'Company',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'FAQFallback',
        path: '#/faq',
        component: () => import('pages/faq/FAQ.vue'),
        meta: {
          Title: 'FAQ',
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
          Title: 'FAQMenu',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'FAQMenuFallback',
        path: '#/faqs',
        component: () => import('pages/faq/FAQMenu.vue'),
        meta: {
          Title: 'FAQMenu',
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
          Title: 'Partners',
          ShowHeaderAnnouncement: true,
          ShowMainHeader: true,
          ShowBigLogo: true,
          ShowFooterTop: true,
          ShowSignHelper: true,
          ShowTopTip: false,
          NeedLogined: false
        }
      }, {
        name: 'PartnersFallback',
        path: '#/partners',
        component: () => import('pages/Partners.vue'),
        meta: {
          Title: 'Partners',
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
          Title: 'Dashboard',
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
        name: 'DashboardFallback',
        path: '#/dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: {
          Title: 'Dashboard',
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
          Title: 'Wallet',
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
        name: 'WalletFallback',
        path: '#/wallet',
        component: () => import('pages/Wallet.vue'),
        meta: {
          Title: 'Wallet',
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
          Title: 'Notification',
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
        name: 'NotificationFallback',
        path: '#/notification',
        component: () => import('pages/Notification.vue'),
        meta: {
          Title: 'Notification',
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
          Title: 'Affiliate',
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
        name: 'AffiliatesFallback',
        path: '#/affiliates',
        component: () => import('pages/Affiliates.vue'),
        meta: {
          Title: 'Affiliate',
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
          Title: 'SetupAffiliate',
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
        name: 'SetupAffiliateFallback',
        path: '#/setup/affiliate',
        component: () => import('pages/SetupAffiliate.vue'),
        meta: {
          Title: 'SetupAffiliate',
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
          Title: 'Account',
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
        name: 'AccountFallback',
        path: '#/account',
        component: () => import('pages/Account.vue'),
        meta: {
          Title: 'Account',
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
          Title: 'Security',
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
        name: 'SecurityFallback',
        path: '#/security',
        component: () => import('pages/Security.vue'),
        meta: {
          Title: 'Security',
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
          Title: 'KYC',
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
        name: 'KYCFallback',
        path: '#/kyc',
        component: () => import('pages/KYC.vue'),
        meta: {
          Title: 'KYC',
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
          Title: 'Resources',
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
        name: 'ResourcesFallback',
        path: '#/resource',
        component: () => import('pages/Resources.vue'),
        meta: {
          Title: 'Resources',
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
          Title: 'Purchase',
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
        name: 'PurchaseFallback',
        path: '#/purchase',
        component: () => import('pages/Purchase.vue'),
        meta: {
          Title: 'Purchase',
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
          Title: 'BalancePayment',
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
        name: 'BalancePaymentFallback',
        path: '#/payment',
        component: () => import('pages/BalancePayment.vue'),
        meta: {
          Title: 'BalancePayment',
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
          Title: 'Payment',
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
        name: 'PaymentFallback',
        path: '#/extrapayment',
        component: () => import('pages/Payment.vue'),
        meta: {
          Title: 'Payment',
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
          Title: 'OrderDetail',
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
        name: 'OrderDetailFallback',
        path: '#/detail',
        component: () => import('pages/OrderDetail.vue'),
        meta: {
          Title: 'OrderDetail',
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
          Title: 'UpdatePassword',
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
        name: 'UpdatePasswordFallback',
        path: '#/update/password',
        component: () => import('pages/UpdatePassword.vue'),
        meta: {
          Title: 'UpdatePassword',
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
        name: 'GenerateCode',
        path: 'generate/code',
        component: () => import('pages/GenerateCode.vue'),
        meta: {
          Title: 'GenerateCode',
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
        name: 'GenerateCodeFallback',
        path: '#/generate/code',
        component: () => import('pages/GenerateCode.vue'),
        meta: {
          Title: 'GenerateCode',
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
          Title: 'UpdateEmail',
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
        name: 'UpdateEmailFallback',
        path: '#/update/email',
        component: () => import('pages/UpdateEmail.vue'),
        meta: {
          Title: 'UpdateEmail',
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
          Title: 'UpdateMobile',
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
        name: 'UpdateMobileFallback',
        path: '#/update/mobile',
        component: () => import('pages/UpdateMobile.vue'),
        meta: {
          Title: 'UpdateMobile',
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
          Title: 'EnableGoogle',
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
        name: 'EnableGoogleFallback',
        path: '#/enable/google',
        component: () => import('pages/EnableGoogle.vue'),
        meta: {
          Title: 'EnableGoogle',
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
          Title: 'VerifyGoogle',
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
        name: 'VerifyGoogleFallback',
        path: '#/verify/google',
        component: () => import('pages/VerifyGoogle.vue'),
        meta: {
          Title: 'VerifyGoogle',
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
          Title: 'AddAddress',
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
        name: 'AddAddressFallback',
        path: '#/add/address',
        component: () => import('pages/AddAddress.vue'),
        meta: {
          Title: 'AddAddress',
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
          Title: 'AddTransferAddress',
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
        name: 'AddTransferAddressFallback',
        path: '#/add/transferaccount',
        component: () => import('pages/AddTransferAddress.vue'),
        meta: {
          Title: 'AddTransferAddress',
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
          Title: 'Withdraw',
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
        name: 'WithdrawFallback',
        path: '#/withdraw',
        component: () => import('pages/Withdraw.vue'),
        meta: {
          Title: 'Withdraw',
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
        path: '#/remainder/mobile',
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
        path: '#/remainder/affiliate',
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
        path: '#/remainder/kyc',
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
        path: '#/remainder/ga',
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
          Title: 'ResetPassword',
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
        name: 'ResetPasswordFallback',
        path: '#/reset/password',
        component: () => import('pages/ResetPassword.vue'),
        meta: {
          Title: 'ResetPassword',
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
          Title: 'Aleo',
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
        name: 'AleoFallback',
        path: '#/product/aleo',
        component: () => import('pages/product/Aleo.vue'),
        meta: {
          Title: 'Aleo',
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
          Title: 'AleoSilver',
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
        name: 'AleoSilverFallback',
        path: '#/product/aleosilver',
        component: () => import('pages/product/AleoSilver.vue'),
        meta: {
          Title: 'AleoSilver',
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
        name: 'AleoSilver2',
        path: 'product/hgkfh97hg5497h',
        component: () => import('pages/product/AleoSilver2.vue'),
        meta: {
          Title: 'AleoSilver2',
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
        name: 'AleoSilver2Fallback',
        path: '#/product/hgkfh97hg5497h',
        component: () => import('pages/product/AleoSilver2.vue'),
        meta: {
          Title: 'AleoSilver2',
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
          Title: 'IronFish2',
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
        name: 'IronFish2Fallback',
        path: '#/product/ironfish',
        component: () => import('pages/product/IronFish2.vue'),
        meta: {
          Title: 'IronFish2',
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
          Title: 'IronFish',
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
        name: 'IronFishFallback',
        path: '#/product/old/ironfish',
        component: () => import('pages/product/IronFish.vue'),
        meta: {
          Title: 'IronFish',
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
          Title: 'Spacemesh',
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
        name: 'SpacemeshFallback',
        path: '#/product/spacemesh',
        component: () => import('pages/product/Spacemesh.vue'),
        meta: {
          Title: 'Spacemesh',
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
        name: 'Btc',
        path: 'product/btc',
        component: () => import('pages/product/Btc.vue'),
        meta: {
          Title: 'Btc',
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
        name: 'BtcFallback',
        path: '#/product/btc',
        component: () => import('pages/product/Btc.vue'),
        meta: {
          Title: 'Btc',
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
