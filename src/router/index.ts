import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'
import { loginInterceptor } from 'npool-cli-v2/utils'
import { useSettingStore } from 'src/localstore'
import { BaseMenu } from 'src/menus/menus'

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
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })

  router.beforeEach((to, _, next) => {
    const setting = useSettingStore()
    setting.ShowSideMenu = to.meta.ShowSideMenu ? to.meta.ShowSideMenu : false

    BaseMenu.children.forEach((menu) => {
      if (to.path.includes(menu.target)) {
        setting.ActiveMenuTarget = menu.target
      }
    })

    loginInterceptor('/signin', to, next)
  })

  return router
})
