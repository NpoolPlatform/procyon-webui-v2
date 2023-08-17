import { route } from 'quasar/wrappers'
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import routes from './routes'
import { loginInterceptor } from 'npool-cli-v4/utils'
import { useSettingStore } from 'src/localstore'
import { BaseMenu } from 'src/menus/menus'
import { useLocalAppStore } from 'src/localstore/app'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// TODO here can invoke global store
export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory

  const router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (to.hash) {
            resolve({ el: to.hash })
            return
          }
          if (savedPosition) {
            resolve({ top: savedPosition.top })
          } else {
            resolve({ top: 0 })
          }
        }, 100)
      })
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.BASE_URL)
  })

  router.beforeEach((to, _, next) => {
    if (to.fullPath.startsWith('/#/') && !to.fullPath.includes('?')) {
      to.fullPath = to.path = to.fullPath.replace('/#', '')
      window.location = to.fullPath as Location | (string & Location)
    }

    const setting = useSettingStore()

    setting.ShowSideMenu = to.meta.ShowSideMenu ? to.meta.ShowSideMenu : false
    setting.ShowMainHeader = to.meta.ShowMainHeader ? to.meta.ShowMainHeader : false
    setting.ShowFooterTop = to.meta.ShowMainHeader ? to.meta.ShowMainHeader : false

    const app = useLocalAppStore()

    if (app.App?.Maintaining) {
      if (to.path !== '/maintenance') {
        next({ path: '/maintenance', replace: true })
        return
      }
    }
    if (!to.path.startsWith('/testing') && to.path !== '/') {
      next({ path: '/', replace: true })
      return
    }
    BaseMenu.children.forEach((menu) => {
      if (to.path.includes(menu.target)) {
        setting.ActiveMenuTarget = menu.target
      }
    })

    loginInterceptor('/signin', to, next)
  })

  return router
})
